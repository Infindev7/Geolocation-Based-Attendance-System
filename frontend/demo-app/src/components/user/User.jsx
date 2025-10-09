import React, { Component } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon issue with webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
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
    if (!this.stored || !this.stored.passHash) {
      this.setState({ loading: false })
      return
    }
    axios.post("http://localhost:8080/api/verify", {
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
            if (distance <= CAMPUS_RADIUS) {
              this.setState({ attendance: true })
              axios.post('http://localhost:8080/api/addLoc', {
                id: this.stored.id,
                passHash: this.stored.passHash,
                latitude: location.latitude,
                longitude: location.longitude,
                distance: distance
              }).catch(err => console.error("Send loc error", err))
              .finally(() => this.setState({ loading: false }))
            } else {
              // Outside bounds
              this.setState({ loading: false })
            }
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
      return <h3>Not authorized (hash mismatch or missing)</h3>
    }

    const userPosition = this.state.location
      ? [this.state.location.latitude, this.state.location.longitude]
      : null;

    const mapCenter = userPosition || CAMPUS_COORDS;

    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Hi {this.state.name}!</h1>

        <button
          onClick={this.handleCheckAttendance}
          disabled={this.state.loading || !this.state.authOk}
          style={{ marginBottom: '1rem', padding: '10px 15px', fontSize: '16px' }}
        >
          {this.state.loading ? 'Checking...' : 'Check Attendance'}
        </button>

        {this.state.location ? (
          <p>
            Latitude: {this.state.location.latitude.toFixed(4)}<br />
            Longitude: {this.state.location.longitude.toFixed(4)}
          </p>
        ) : (
          <p>Click the button to get your location.</p>
        )}

        {this.state.distance !== null && (
          <p>Distance from campus center: {this.state.distance.toFixed(2)} meters</p>
        )}

        {this.state.authOk && !this.state.loading && this.state.distance !== null && (
          this.state.attendance
            ? <h3 style={{ color: 'green' }}>Attendance marked! You are within the campus bounds.</h3>
            : <h3 style={{ color: 'red' }}>Out of campus bounds.</h3>
        )}

        <div style={{ height: '400px', width: '80%', marginTop: '2rem' }}>
          <MapContainer 
            center={mapCenter} 
            zoom={17} 
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
            key={mapCenter.join('_')} // Force re-render when center changes
          >
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
              <Marker position={userPosition}>
                <Popup>
                  Your Location
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    )
  }
}

export default User
