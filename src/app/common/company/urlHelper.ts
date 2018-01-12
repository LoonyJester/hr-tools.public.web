export class UrlHelper {
    public getAuthUrl(host: string): string {
        switch (host) {
            case "localhost": {
                return "https://teaminternational.auth:44311/";
            }
            case "teaminternational": {
                return "https://teaminternational.auth:44311/";
            }
            case "company": {
                return "https://company.auth:44314/core/";
            }
        }
    }

    public getApiUrl(host: string): string {
        switch (host) {
            case "localhost": {
                return "http://teaminternational:8085/";
            }
            case "teaminternational": {
                return "http://teaminternational:8085/";
            }
            case "company": {
                return "http://company:8095/";
            }
        }
    }
}