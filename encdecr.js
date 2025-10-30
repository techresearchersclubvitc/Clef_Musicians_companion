// Simple encryption and decryption using a substitution cipher
// mapping specific words to symbols and vice versa.
// defining a dictionary for substitution
const dict = {
      "S": "+5",
      "R": "-5",
      "G": "+6",
      "M": "-6"
    };
// encryption function
// encrypts input text by replacing words based on the dictionary
    function encryption(input, dict) {
      const lines = input.trim().split('\n');
      return lines.map(line =>
        line.split(/\s+/).map(word => dict[word] || word).join(' ')
      ).join('\n');
    }

// decryption function
// decrypts input text by reversing the substitutions based on the dictionary
    function decryption(input, dict) {
      const reverseDict = Object.fromEntries(
        Object.entries(dict).map(([k, v]) => [v, k])
      );
      const lines = input.trim().split('\n');
      return lines.map(line =>
        line.split(/\s+/).map(word => reverseDict[word] || word).join(' ')
      ).join('\n');
    }

   