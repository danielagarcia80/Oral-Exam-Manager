export class Uuid {
  constructor() {}
  generateUUID(): string {
    // Generates a random number as a string with the given base
    function getRandomValues(base: number): string {
      return Math.random().toString(base).substring(2);
    }

    // Returns a string with 4 random hexadecimal characters
    function s4(): string {
      return getRandomValues(16).substring(0, 4);
    }

    // Format of UUID: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    // 4xxx: The 4 indicates that this is a version 4 UUID
    // yxxx: The first hexadecimal digit of this is a number from 8 to b
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      "4" +
      s4().substring(1) +
      "-" +
      ((parseInt(s4().substring(0, 1), 16) & 0x3) | 0x8).toString(16) +
      s4().substring(1) +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }
}
