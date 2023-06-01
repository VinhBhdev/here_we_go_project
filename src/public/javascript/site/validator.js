



function Validator(options) {
    // console.log(options);

    function getParent(element, selector) {
        while (element.parentElement) {
            // console.log(">>>check");
            // console.log(element);
            if (element.matches(selector)) {
                return element;
            }
            element = element.parentElement;
        }
        return element;
    }
    let formElement = document.querySelector(options.form);
    let selectorRules = {};
    // console.log(formElement);

    formElement.onsubmit = function (e) {
        let isFormValid = true;
        e.preventDefault();
        options.rules.forEach(function (rule) {
            let isValid = validate(formElement.querySelector(rule.selector), rule);
            // console.log(">>>good");
            // console.log(rule.selector);
            // console.log(formElement.querySelector(rule.selector));
            if (!isValid) {
                isFormValid = false;
            }
        })
        if (isFormValid) {
            if (typeof options.onSubmit === 'function') {
                let EnableInput = formElement.querySelectorAll('[name]');
                let formValue = {}
                for (let i = 0; i < EnableInput.length; i++) {
                    switch (EnableInput[i].type) {
                        case 'radio': 
                            if(EnableInput[i].matches(':checked')){
                                formValue[EnableInput[i].name] = EnableInput[i].value;
                            }
                            break;
                        case 'checkbox':
                            if(!Array.isArray(formValue[EnableInput[i].name])){
                                formValue[EnableInput[i].name] = [];
                            }
                            
                            if (EnableInput[i].matches(':checked')) {
                                formValue[EnableInput[i].name].push(EnableInput[i].value);
                            }
                            break;
                        case 'file':
                            formValue[EnableInput[i].name] = EnableInput[i].files;
                            break;
                        default:
                            formValue[EnableInput[i].name] = EnableInput[i].value;
                    }

                }
                options.onSubmit(formValue);
                formElement.submit();
            }
            else {
                formElement.submit();
            }
        }

    }


    let validate = function (inputElement, rule) {
        // let errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        // console.log(inputElement);
        let errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        // console.log(getParent(inputElement, options.formGroupSelector));
        let val = inputElement.value;
        let errorMessage;
        let rules = selectorRules[rule.selector];
        for (let i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'radio': case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    )
                    break;
                default:
                    errorMessage = rules[i](val);

            }
            if (errorMessage) break;
        }


        if (errorMessage) {
            errorElement.innerHTML = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        }
        else {
            errorElement.innerHTML = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');

        }
        return !errorMessage;
    }




    options.rules.forEach(function (rule) {
        let inputElements = formElement.querySelectorAll(rule.selector);
        // console.log(inputElements);
        if (Array.isArray(selectorRules[rule.selector])) {
            selectorRules[rule.selector].push(rule.test);
        }
        else {
            selectorRules[rule.selector] = [rule.test];
        }

        Array.from(inputElements).forEach(function (inputElement) {
            // Xử lý trường hợp blur khỏi input
            inputElement.onblur = function () {
                validate(inputElement, rule);
            }

            // Xử lý mỗi khi người dùng nhập vào input
            inputElement.oninput = function () {
                var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                errorElement.innerText = '';
                getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
            }
        });


    });

}


Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (val) {
            return val ? undefined : message || 'Vui lòng nhập trường này!';
        }
    }
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (val) {
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(val) ? undefined : message || 'Trường này phải là email';
        }
    }

}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (val) {
            return val.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`
        }
    }

}


Validator.getElementValue = function (parentSelector, selector) {
    let parentElement = document.querySelector(parentSelector);
    return parentElement.querySelector(selector).value;
}

Validator.isConfirmed = function (selector, parentSelector, otherSelector, message) {
    return {
        selector: selector,
        test: function (val1) {
            return val1 === Validator.getElementValue(parentSelector, otherSelector) ? undefined : message || 'Giá trị nhập vào không đúng!';
        }
    }

}


