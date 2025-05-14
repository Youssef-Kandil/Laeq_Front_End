class regex {

  static get cmail() {
    return /^[a-zA-Z][a-zA-Z0-9._%+-]*[a-zA-Z0-9]@creators\.com$/;
  }
  static get user_name() {
    return /^[a-zA-Zء-ي ]{1,25}$/;
  }

  static get instagram() {
    return /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._%+-]+\/?\?.*$/;
  }
  
  static get linkedIn() {
    return /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_%]+\/?$/gm;
  }

  static get X() {
    return /^https?:\/\/(www\.)?x\.com\/[a-zA-Z0-9_]+(\/|\?.*)?$/
  }

  static get facebook() {
    return /^https?:\/\/(www\.)?facebook\.com\/(profile\.php\?id=\d+|[a-zA-Z0-9.]+)(\/|\?.*)?$/;
  }

  static get tiktok() {
    return /^https?:\/\/(www\.)?tiktok\.com\/(@[a-zA-Z0-9._-]+)(\/|\?.*)?$/;
  }

  static get snapChat() {
    return /^https?:\/\/(www\.)?snapchat\.com\/add\/[a-zA-Z0-9._-]+\?share_id=[a-zA-Z0-9._-]+(&[a-zA-Z0-9=_-]+)*$/;
  }


  static get password() {
    // [1] A - a
    // [2] 0 - 9
    // [3] Special characters (e.g. !, @, #, $, %, ^, &, *)
    // [4] 8 - 16 characters
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,16}$/;
    }


    
    static get birth_date() {
        // [1] 1960 - 2007
        // [2] age 18 - 65
        return /^(196[0-9]|19[7-9][0-9]|200[0-7])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/gm;
    }

    static get gmail() {
        return /^[a-zA-Z][a-zA-Z0-9._%+-]*[a-zA-Z0-9]@gmail\.com$/;
      }

    static get phone() {
        return /^\+?[1-9]\d{1,14}$/;
    }


    static get email() {
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    }

    static get iban() {
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    }
}

export default regex;