import { HttpService } from '../http';

export interface UrlBuilderParams {
  [key: string]: string | number;
}

export class RoutesBuilderService {
  public static build(route: string, params: UrlBuilderParams = {}): string {
    let output = route;

    Object.keys(params).map((key) => {
      output = output.replace(`:${key}`, params[key].toString());
    });

    return output;
  }

  public static buildWithBaseUrl(route: string, params: UrlBuilderParams = {}) {
    const newRoute = `${HttpService.baseUrl}${route}`;
    return RoutesBuilderService.build(newRoute, params);
  }
}
