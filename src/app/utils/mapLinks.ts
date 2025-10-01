// params: lat, lng as numbers or strings
export function generateMapLinks(lat: number | string, lng: number | string) {
    const latStr = String(lat).trim();
    const lngStr = String(lng).trim();
  
    return {
      google_search: `https://www.google.com/maps/search/?api=1&query=${latStr},${lngStr}`,
      google_at: `https://www.google.com/maps/@${latStr},${lngStr},15z`,
      google_directions: `https://www.google.com/maps/dir/?api=1&destination=${latStr},${lngStr}`,
      google_app_scheme: `comgooglemaps://?center=${latStr},${lngStr}&q=${latStr},${lngStr}&zoom=16`,
      apple_maps: `http://maps.apple.com/?ll=${latStr},${lngStr}`,
    };
  }
  
  // مثال استخدام:
//   console.log(generateMapLinks(31.22768, 29.96940));
  