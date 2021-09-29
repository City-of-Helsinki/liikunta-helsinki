import { Coordinates } from "../../types";
import { logger } from "../../domain/logger";

class GeolocationService {
  getCurrentPosition(): Promise<Coordinates> {
    return new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          logger.error(`Failed to use geolocation: ${error.message}`);
          reject(error);
        }
      )
    );
  }
}

export default new GeolocationService();
