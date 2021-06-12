export class BookyConfig {
  private static path = 'http://localhost:3000';//https://sparebits.herokuapp.com';

  public static getPath(): string {
    return BookyConfig.path;
  }
}
