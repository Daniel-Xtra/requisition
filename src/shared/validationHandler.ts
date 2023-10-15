import _ from "lodash";

export const validationHandler = (err, data) => {
    if (err) {

        const message: string = err.details[0].message.replace(/['"]/g, "");

        // Joi Error
        const JoiError = {
            status: false,
            message,
        };

        // Send back the JSON error response
        return { status: false, data: JoiError };

    } else {
        // Return with the data after Joi validation
        return { status: true, data };
    }

};
