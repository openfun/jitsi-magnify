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
}
