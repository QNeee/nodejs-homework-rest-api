class ContactsNode extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
    }
}
class NotFound extends ContactsNode {
    constructor(message) {
        super(message);
        this.status = 404;
    }
}
class ValidationError extends ContactsNode {
    constructor(message) {
        super(message);
        this.status = 400;
    }
}
class WrongParametersError extends ContactsNode {
    constructor(message) {
        super(message);
        this.status = 403;
    }
}
class NotAuthorized extends ContactsNode {
    constructor(message) {
        super(message);
        this.status = 401;
    }
}
class RegistrationConflictError extends ContactsNode {
    constructor(message) {
        super(message);
        this.status = 409;
    }
}
module.exports = {
    ContactsNode,
    ValidationError,
    WrongParametersError,
    NotAuthorized, RegistrationConflictError, NotFound
}