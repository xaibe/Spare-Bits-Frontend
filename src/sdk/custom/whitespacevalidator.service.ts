import { AbstractControl } from "@angular/forms";

import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class WhiteSpaceValidator {
  public spaceValidator(control: AbstractControl) {
    if (
      control &&
      control.value &&
      !control.value.replace(/^\s+|\s+$/g, "").length
    ) {
      control.setValue("");
      console.log(control.value);

      return { required: true };
    } else {
      return null;
    }
  }
}

//str.replace(/\s/g, "");
