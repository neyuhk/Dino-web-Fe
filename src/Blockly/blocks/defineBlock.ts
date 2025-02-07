import * as Blockly from 'blockly/core'

const addText = {
    type: 'add_text',
    message0: 'Add text %1',
    args0: [
        {
            type: 'input_value',
            name: 'TEXT',
            check: 'String',
        },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: '',
    helpUrl: '',
}
const logText = {
    type: 'log_text',
    message0: 'Log text %1',
    args0: [
        {
            type: 'input_value',
            name: 'TEXT',
            check: 'String',
        },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: '',
    helpUrl: '',
}


// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    addText,
    logText,
])
