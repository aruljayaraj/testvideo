import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface Props { 
    lat: string,
    lng: string
}
const ContactMap: React.FC<Props> = ({ lat, lng } ) => {
  const center = {
    lat: +(lat),
    lng: +(lng)
  };

  const onLoad = (marker: any) => {
    // console.log('marker: ', marker)
  }

  const containerStyle = {
    width: '400px',
    height: '200px'
  };

  return (
      <>
        { (lat && lng) && <LoadScript
        googleMapsApiKey="AIzaSyCHlO8Xjl6IS9YOcCWgsgFjkWmiNr77xjM"
        >
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
        >
            <Marker
                onLoad={onLoad}
                position={center}
            />
        </GoogleMap>
        </LoadScript>
        }
    </>
  )
}
 
export default ContactMap;