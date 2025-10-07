import React, { Component } from 'react'
import axios from 'axios'

export class User extends Component {

  constructor(props) {
    super(props)
    this.state = {
      location: null,
      name: props.name || "User",
      distance: null,
      attendance: false
    }
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          this.setState({ location }, () => {
            // All code that needs location goes here
            function degToRad(degrees) {
              return degrees * Math.PI / 180;
            }

            function haversineDistance(lat1, lon1, lat2, lon2) {
              const R = 6371; // Radius of the Earth in kilometers.
              const dLat = degToRad(lat2 - lat1);
              const dLon = degToRad(lon2 - lon1);
              const radLat1 = degToRad(lat1);
              const radLat2 = degToRad(lat2);
              const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(radLat1) * Math.cos(radLat2) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              return (R * c) * 1000; // Distance in meters.
            }

            const lat1 = location.latitude;
            const lat2 = 19.384200;
            const lon1 = location.longitude;
            const lon2 = 72.828824;
            const distance = haversineDistance(lat1, lon1, lat2, lon2);
            this.setState({ distance }, () => {
                // Mark attendance if within 60m 
                if (distance <= 105) {
                    this.setState({ attendance: true }, () => {
                      // Send POST request after attendance is marked
                      axios.post('http://localhost:8080/api/addLoc', {
                        name: this.state.name,
                        latitude: this.state.location.latitude,
                        longitude: this.state.location.longitude,
                        distance: this.state.distance
                      })
                      .then(response => {
                        console.log('Location sent:', response.data);
                      })
                      .catch(error => {
                        console.error('Error sending location:', error);
                      });
                    });
                }
            });
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  render() {
    return (
      <>
        <h1>Hi {this.state.name}!</h1>
        {this.state.location ? (
          <p>
            Latitude: {this.state.location.latitude.toFixed(4)}<br />
            Longitude: {this.state.location.longitude.toFixed(4)}
          </p>
        ) : (
          <p>Getting location...</p>
        )}
        {this.state.distance !== null && (
          <p>
            Distance: {this.state.distance.toFixed(2)} meters
          </p>
        )}
        {this.state.attendance ? (
          <h3>Attendance marked!</h3>
        ) : (<h3>You are out of Campus Bounds</h3>)}
      </>
    )
  }
}

export default User
