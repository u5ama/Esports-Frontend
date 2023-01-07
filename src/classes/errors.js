class Errors {
    constructor() {
        this.errors = {};
    }

    get(field) {
        if(this.errors.length) {
            let error = this.errors.find(function (elem) {
                if(elem.param === field) {
                    return elem['msg'];
                }
            });
            if(error) {
                return error.msg;
            }
        }
    }

    record(err) {
        this.errors = err;
    }

    has(field) {
        if(this.errors.length) {
            return this.errors.find((elem) => {
                return elem.param == field;
            })
        }
        return false;
    }

    clear(field) {
        if(this.errors.length) {
            this.errors = this.errors.filter(function( obj ) {
                return obj.param !== field;
            });
        }
    }
}

export default Errors;