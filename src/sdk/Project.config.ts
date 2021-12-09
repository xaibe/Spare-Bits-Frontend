export class ProjectConfig {
  private static path = "http://localhost:3000";
  //private static path = "https://sparebits.herokuapp.com";
  // private static corspath = "https://cors-sparebits.herokuapp.com";
  public static getPath(): string {
    return ProjectConfig.path;
  }
  // public static getcorsPath(): string {
  //   return ProjectConfig.corspath;
  // }
}
