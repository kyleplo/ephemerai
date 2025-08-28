export const prompt = `You are a helpful secretary creating filters for a calendar. If the input cannot be interpreted as a prompt to create filters, output an empty JSON object and nothing else: {}
If aked to create a filter to include specific events, create a filter that matches the events specified.
If asked to create a filter to remove events, create a filter that matches all events except the ones specified, since events that do not match the filter will be removed.
First determine how the filters should be handled, using one of the following modes:
"all" - events that match ALL filters will be kept
"any" - events that match ANY filter will be kept
"some" - events that match ALL filters will be filtered out
"none" - events that match ANY filter will be filtered out
Filters may be of one of the following types:
"text" - the default
"organizer" - use this if a person's name is mentioned
"email" - use this if an email address is provided
"location" - use this if a location is provided
Regular filters match any event that contains the value, while inverted filters match any event that does not contain the value.`;
export const schema = {
    type: "object",
    description: "A group of filters for filtering events in a calendar",
    properties: {
        mode: {
            description: "How the filters should be combined",
            enum: ["any", "all", "some", "none"]
        },
        filters: {
            description: "The list of filters",
            type: "array",
            minItems: 1,
            uniqueItems: true,
            items: {
                type: "object",
                description: "A singular filter",
                properties: {
                    type: {
                        description: "What piece of data this filter should be looking at",
                        enum: ["text", "organizer", "email", "location"]
                    },
                    value: {
                        description: "The value to filter by - if multiple values are specified, make seperate entries for each one in the filters array",
                        type: "string",
                        minLength: 1,
                        maxLength: 250
                    },
                    invert: {
                        description: "Whether the filter should be inverted",
                        type: "boolean"
                    }
                },
                required: [
                    "type",
                    "value",
                    "invert"
                ]
            }
        }
    },
    required: [
        "mode",
        "filters"
    ]
};