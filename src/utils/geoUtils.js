export const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3
  const φ1 = lat1 * Math.PI/180
  const φ2 = lat2 * Math.PI/180
  const Δφ = (lat2-lat1) * Math.PI/180
  const Δλ = (lon2-lon1) * Math.PI/180
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export const calculateNewPos = (lat, lng, bearing, distanceMeters) => {
  const R = 6378.1 
  const brng = bearing * Math.PI / 180 
  const d = distanceMeters / 1000 

  let lat1 = lat * Math.PI / 180
  let lon1 = lng * Math.PI / 180

  let lat2 = Math.asin( Math.sin(lat1)*Math.cos(d/R) + Math.cos(lat1)*Math.sin(d/R)*Math.cos(brng) )
  let lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(lat1), Math.cos(d/R)-Math.sin(lat1)*Math.sin(lat2))

  return [lon2 * 180 / Math.PI, lat2 * 180 / Math.PI]
}