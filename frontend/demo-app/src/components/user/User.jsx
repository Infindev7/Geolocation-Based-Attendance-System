import React, { Component, useEffect } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './User.css'
import L from 'leaflet'
import { FaLocationDot, FaMapLocationDot } from "react-icons/fa6";
import { TbLocationCheck } from "react-icons/tb";


// Fix for default marker icon issue with webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Helper component to update map view and invalidate size
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
    // A small delay is sometimes needed to ensure the container is sized correctly
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [center, map]);
  return null;
}

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Define a new icon for the user's location (e.g., red)
const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const CAMPUS_COORDS = [19.384200, 72.828824];
const CAMPUS_RADIUS = 105; // in meters

export class User extends Component {

  constructor(props) {
    super(props)
    let stored = null
    try {
      stored = JSON.parse(localStorage.getItem("userData") || "null")
    } catch (err) { console.error(err) }
    this.state = {
      location: null,
      name: stored?.name || "User",
      distance: null,
      attendance: false,
      authOk: false,
      loading: true
    }
    this.stored = stored
  }

  componentDidMount() {
    const apiUrl = import.meta.env.VITE_API_URL
    if (!this.stored || !this.stored.passHash) {
      this.setState({ loading: false })
      return
    }
    axios.post(`${apiUrl}/api/verify`, {
      id: this.stored.id,
      passHash: this.stored.passHash
    }).then(res => {
      if (res.data.valid) {
        // Authorized; wait for user to click button to check attendance
        this.setState({ authOk: true, name: res.data.name, loading: false })
      } else {
        this.setState({ loading: false })
      }
    }).catch(() => this.setState({ loading: false }))
  }

  handleCheckAttendance = () => {
    this.setState({
      loading: true,
      attendance: false,
      distance: null,
      location: null
    }, () => this.acquireLocation())
  }

  acquireLocation() {
    const apiUrl = import.meta.env.VITE_API_URL
    if (!navigator.geolocation) {
      console.error("Geolocation not supported")
      this.setState({ loading: false })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        this.setState({ location }, () => {
          const degToRad = d => d * Math.PI / 180
          const haversineDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371
            const dLat = degToRad(lat2 - lat1)
            const dLon = degToRad(lon2 - lon1)
            const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
              Math.sin(dLon / 2) ** 2
            return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))) * 1000
          }
            // Campus reference coords
          const distance = haversineDistance(
            location.latitude,
            location.longitude,
            CAMPUS_COORDS[0],
            CAMPUS_COORDS[1]
          )
          this.setState({ distance }, () => {
            // Always send location update to the server, even if out of bounds
            axios.put(`${apiUrl}/api/addLoc`, {
              id: this.stored.id,
              passHash: this.stored.passHash,
              latitude: location.latitude,
              longitude: location.longitude,
              distance: distance
            }).then(res => {
              const saved = res?.data?.saved === true
              const isInside = distance <= CAMPUS_RADIUS
              // mark attendance only if the student is inside campus AND server saved the record
              this.setState({ attendance: saved && isInside })
            }).catch(err => {
              console.error("Send loc error", err)
              // ensure attendance is false on error
              this.setState({ attendance: false })
            }).finally(() => this.setState({ loading: false }))
          })
        })
      },
      (error) => {
        console.error("Geolocation error:", error)
        this.setState({ loading: false })
      }
    )
  }

  render() {
    if (!this.state.authOk && !this.state.loading) {
      return <h3 style={{color: "red"}}>Not authorized (hash mismatch or missing)</h3>
    }

    const userPosition = this.state.location
      ? [this.state.location.latitude, this.state.location.longitude]
      : null;

    const mapCenter = userPosition || CAMPUS_COORDS;

    return (
      <div className="user-page-container">
        <div className="login-header">
                <TbLocationCheck /> EduTrack
        </div>
        <div className="info-panel">
          <h1>Hi {this.state.name}!</h1>

          <div className='info-location'>
            
              {this.state.location ? (
                <div className='coords'>
                  <h1><FaLocationDot /></h1>
                  <p>
                    Latitude: {this.state.location.latitude.toFixed(4)}<br />
                    Longitude: {this.state.location.longitude.toFixed(4)}
                  </p>
                </div>
              ) : (
                <p>Click the button to get your location and mark attendance.</p>
              )}
            

            
              {this.state.distance !== null && (
                <div className='dist'>
                  <h1><FaMapLocationDot /></h1><p>Distance: <strong>{this.state.distance.toFixed(2)} meters</strong></p>
                </div>
              )}
            
            
          </div>

          <button
            onClick={this.handleCheckAttendance}
            disabled={this.state.loading || !this.state.authOk}
            className="attendance-button"
          >
            {this.state.loading ? 'Checking...' : 'Check Attendance'}
          </button>

          {this.state.authOk && !this.state.loading && this.state.distance !== null && (
            this.state.attendance
              ? <h3 className="status-message success">Attendance marked! You are within the campus bounds.</h3>
              : <h3 className="status-message error">Out of campus bounds.</h3>
          )}
        </div>

        <div className="map-panel">
          <div className="map-container-wrapper">
            <MapContainer 
              center={mapCenter} 
              zoom={17} 
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <MapUpdater center={mapCenter} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Campus Location and Radius */}
              <Circle
                center={CAMPUS_COORDS}
                pathOptions={{ color: 'green', fillColor: 'green' }}
                radius={CAMPUS_RADIUS}
              />
              <Marker position={CAMPUS_COORDS}>
                <Popup>
                  Campus Center
                </Popup>
              </Marker>

              {/* User Location */}
              {userPosition && (
                <Marker position={userPosition} icon={userIcon}>
                  <Popup>
                    Your Location
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    )
  }
}

export default User
