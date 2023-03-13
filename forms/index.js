// require in caolan forms
const forms = require('forms');
// handy shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

const bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createProductForm = function(categories, tags) {
    // forms.create allows us to create a new form definition
    // instead of using HTML to write the forms, we use objects to define them
    // the `key` will be the value for the name attribute
    // the `value` will be the data type and other rules for the field
    return forms.create({
        "name": fields.string({
            "required": true, // cannot skip, complusory form field
            "errorAfterField": true // if any error messages display after the form field
        }),
        "cost": fields.number({
            "label": "Cost (in cents)",
            "required": true,
            "errorAfterField": true, 
            "validators": [ validators.integer()]    
        }),
        "description": fields.string({
            "required": true,
            "errorAfterField": true
        }),
        "category_id": fields.string({
            "label": 'Category',
            "required": true,
            "errorAfterField": true,
            "cssClasses": {
                "label": ['form-label'],
            },
            "widget": widgets.select(),
            "choices": categories,
        }),
        "tags": fields.string({
            "required": true,
            "errorAfterField": true,
            "cssClasses": {
                "label": ['form-label'],
            },
            "widget": widgets.multipleSelect(),
            "choices": tags,
        }),
        'image_url': fields.string({
            widget: widgets.hidden(),
        })
    });
}

const createRegistrationForm = () => forms.create(
    {
        username: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label'],
            },
        }),
        email: fields.email({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label'],
            },
        }),
        password: fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label'],
            },
        }),
        confirm_password: fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label'],
            },
            validators: [validators.matchField('password')],
        }),
    }
);

const createLoginForm = () => forms.create({
    username: fields.string({
        required: true,
        errorAfterField: true,
        cssClasses: {
            label: ['form-label'],
        },
    }),
    password: fields.password({
        required: true,
        errorAfterField: true,
        cssClasses: {
            label: ['form-label'],
        },
    }),
})

// export the createProductForm functions etc. so that other JS files can use it
module.exports =  { createProductForm, createRegistrationForm, createLoginForm, bootstrapField };
