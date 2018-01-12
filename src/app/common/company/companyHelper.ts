export class CompanyHelper {
    public getCompanyName(host: string): string {
        switch (host) {
            case "localhost": {
                return "teaminternational";
            }
            case "teaminternational": {
                return "teaminternational";
            }
            case "company": {
                return "company";
            }
        }
    }

    public getCompanyDisplayName(host: string): string {
        switch (host) {
            case "localhost": {
                return "Team International Services Inc.";
            }
            case "teaminternational": {
                return "Team International Services Inc.";
            }
            case "company": {
                return "Company";
            }
        }
    }

    public getCompanyUrl(host: string): string {
        switch (host) {
            case "localhost": {
                return "http://www.teaminternational.com/";
            }
            case "teaminternational": {
                return "http://www.teaminternational.com/";
            }
            case "company": {
                return "https://www.google.com.ua/";
            }
        }
    }
}