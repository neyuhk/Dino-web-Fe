import * as Blockly from 'blockly/core';

// Custom text blocks.
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
};

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
};

// Arduino analog/digital block definitions.

const inoutDigitalWrite = {
  type: "inout_digital_write",
  message0: "DigitalWrite PIN# %1 Stat %2",
  args0: [
    {
      type: "field_dropdown",
      name: "PIN",
      options: [
        ["0", "0"],
        ["1", "1"],
        ["2", "2"],
        ["3", "3"]
      ]
    },
    {
      type: "field_dropdown",
      name: "STAT",
      options: [
        ["HIGH", "HIGH"],
        ["LOW", "LOW"]
      ]
    }
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 230,
  tooltip: "Write digital value to a specific port",
  helpUrl: "http://arduino.cc/en/Reference/DigitalWrite"
};

const inoutDigitalRead = {
  type: "inout_digital_read",
  message0: "DigitalRead PIN# %1",
  args0: [
    {
      type: "field_dropdown",
      name: "PIN",
      options: [
        ["0", "0"],
        ["1", "1"],
        ["2", "2"],
        ["3", "3"]
      ]
    }
  ],
  output: "Boolean",
  colour: 230,
  tooltip: "Read digital value from a specific port",
  helpUrl: "http://arduino.cc/en/Reference/DigitalRead"
};
const logicIf = {
  type: 'controls_if',
  message0: 'if %1 then',
  args0: [
    {
      type: 'input_value',
      name: 'IF0',
      check: 'Boolean'
    }
  ],
  message1: 'do %1',
  args1: [
    {
      type: 'input_statement',
      name: 'DO0'
    }
  ],
  // This simplified version does not include else/elseif.
  previousStatement: null,
  nextStatement: null,
  colour: 210,
  tooltip: 'If condition is true, execute statements.',
  helpUrl: ''
};

const logicCompare = {
  type: 'logic_compare',
  message0: '%1 %2 %3',
  args0: [
    {
      type: 'input_value',
      name: 'A',
      check: 'Number'
    },
    {
      type: 'field_dropdown',
      name: 'OP',
      options: [
        ['=', 'EQ'],
        ['\u2260', 'NEQ'],
        ['<', 'LT'],
        ['\u2264', 'LTE'],
        ['>', 'GT'],
        ['\u2265', 'GTE']
      ]
    },
    {
      type: 'input_value',
      name: 'B',
      check: 'Number'
    }
  ],
  output: 'Boolean',
  colour: 210,
  tooltip: 'Compare two numbers.',
  helpUrl: ''
};

const logicOperation = {
  type: 'logic_operation',
  message0: '%1 %2 %3',
  args0: [
    {
      type: 'input_value',
      name: 'A',
      check: 'Boolean'
    },
    {
      type: 'field_dropdown',
      name: 'OP',
      options: [
        ['and', 'AND'],
        ['or', 'OR']
      ]
    },
    {
      type: 'input_value',
      name: 'B',
      check: 'Boolean'
    }
  ],
  output: 'Boolean',
  colour: 210,
  tooltip: 'Perform logical operations on two booleans.',
  helpUrl: ''
};

const logicNegate = {
  type: 'logic_negate',
  message0: 'not %1',
  args0: [
    {
      type: 'input_value',
      name: 'BOOL',
      check: 'Boolean'
    }
  ],
  output: 'Boolean',
  colour: 210,
  tooltip: 'Returns the opposite of a boolean value.',
  helpUrl: ''
};

const logicBoolean = {
  type: 'logic_boolean',
  message0: '%1',
  args0: [
    {
      type: 'field_dropdown',
      name: 'BOOL',
      options: [
        ['true', 'TRUE'],
        ['false', 'FALSE']
      ]
    }
  ],
  output: 'Boolean',
  colour: 210,
  tooltip: 'Boolean value: true or false.',
  helpUrl: ''
};

const logicNull = {
  type: 'logic_null',
  message0: 'null',
  output: null,
  colour: 210,
  tooltip: 'Null value.',
  helpUrl: ''
};

const logicTernary = {
  type: 'logic_ternary',
  message0: 'if %1 then %2 else %3',
  args0: [
    {
      type: 'input_value',
      name: 'IF',
      check: 'Boolean'
    },
    {
      type: 'input_value',
      name: 'THEN'
    },
    {
      type: 'input_value',
      name: 'ELSE'
    }
  ],
  output: null,
  colour: 210,
  tooltip: 'Select one of two values based on a condition.',
  helpUrl: ''
};
const inoutAnalogWrite = {
  type: "inout_analog_write",
  message0: "AnalogWrite PIN# %1 value %2",
  args0: [
    {
      // PWM-capable pins.
      type: "field_dropdown",
      name: "PIN",
      options: [
        ["3", "3"],
        ["5", "5"],
        ["6", "6"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"]
      ]
    },
    {
      type: "input_value",
      name: "NUM",
      check: "Number"
    }
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 230,
  tooltip: "Write analog value (0-255) to a specific port",
  helpUrl: "http://arduino.cc/en/Reference/AnalogWrite"
};

const inoutAnalogRead = {
  type: "inout_analog_read",
  message0: "AnalogRead PIN# %1",
  args0: [
    {
      // Typical analog input pins.
      type: "field_dropdown",
      name: "PIN",
      options: [
        ["A0", "A0"],
        ["A1", "A1"],
        ["A2", "A2"],
        ["A3", "A3"],
        ["A4", "A4"],
        ["A5", "A5"]
      ]
    }
  ],
  output: "Number",
  colour: 230,
  tooltip: "Return analog value (0-1024)",
  helpUrl: "http://arduino.cc/en/Reference/AnalogRead"
};

const inoutBuildinLed = {
  type: "inout_buildin_led",
  message0: "Build-in LED Stat %1",
  args0: [
    {
      type: "field_dropdown",
      name: "STAT",
      options: [
        ["HIGH", "HIGH"],
        ["LOW", "LOW"]
      ]
    }
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 190,
  tooltip: "Turn the build-in LED on or off",
  helpUrl: "http://arduino.cc/en/Reference/DigitalWrite"
};

// New block: Pin mode (set the mode of a pin)
const inoutPinMode = {
  type: "inout_pin_mode",
  message0: "Set PIN# %1 mode %2",
  args0: [
    {
      type: "field_dropdown",
      name: "PIN",
      options: [
        ["0", "0"],
        ["1", "1"],
        ["2", "2"],
        ["3", "3"],
        ["4", "4"],
        ["5", "5"],
        ["6", "6"],
        ["7", "7"],
        ["8", "8"],
        ["9", "9"],
        ["10", "10"],
        ["11", "11"],
        ["12", "12"],
        ["13", "13"],
        ["A0", "A0"],
        ["A1", "A1"],
        ["A2", "A2"],
        ["A3", "A3"],
        ["A4", "A4"],
        ["A5", "A5"]
      ]
    },
    {
      type: "field_dropdown",
      name: "MODE",
      options: [
        ["INPUT", "INPUT"],
        ["OUTPUT", "OUTPUT"],
        ["INPUT_PULLUP", "INPUT_PULLUP"]
      ]
    }
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 230,
  tooltip: "Set the pin mode",
  helpUrl: "http://arduino.cc/en/Reference/pinMode"
};

// Additional Arduino blocks from base.js

const baseDelay = {
  type: "base_delay",
  message0: "Delay %1",
  args0: [
    {
      type: "input_value",
      name: "DELAY_TIME",
      check: "Number"
    }
  ],
  inputsInline: true,
  previousStatement: null,
  nextStatement: null,
  colour: 120,
  tooltip: "Delay specific time",
  helpUrl: "http://arduino.cc/en/Reference/delay"
};

const baseMap = {
  type: "base_map",
  message0: "Map %1 value to [0-%2]",
  args0: [
    {
      type: "input_value",
      name: "NUM",
      check: "Number"
    },
    {
      type: "input_value",
      name: "DMAX",
      check: "Number"
    }
  ],
  inputsInline: true,
  output: null,  // output block
  colour: 230,
  tooltip: "Re-map a number from [0-1024] to another range",
  helpUrl: "http://arduino.cc/en/Reference/map"
};

const inoutTone = {
  type: "inout_tone",
  message0: "Tone PIN# %1 frequency %2",
  args0: [
    {
      type: "field_dropdown",
      name: "PIN",
      options: [
        ["0", "0"],
        ["1", "1"],
        ["2", "2"],
        ["3", "3"]
      ]
    },
    {
      type: "input_value",
      name: "NUM",
      check: "Number"
    }
  ],
  inputsInline: true,
  previousStatement: null,
  nextStatement: null,
  colour: 230,
  tooltip: "Generate audio tones on a pin",
  helpUrl: "http://www.arduino.cc/en/Reference/Tone"
};

const inoutNotone = {
  type: "inout_notone",
  message0: "No tone PIN# %1",
  args0: [
    {
      type: "field_dropdown",
      name: "PIN",
      options: [
        ["0", "0"],
        ["1", "1"],
        ["2", "2"],
        ["3", "3"]
      ]
    }
  ],
  inputsInline: true,
  previousStatement: null,
  nextStatement: null,
  colour: 230,
  tooltip: "Stop generating a tone on a pin",
  helpUrl: "http://www.arduino.cc/en/Reference/NoTone"
};

const inoutHighlow = {
  type: "inout_highlow",
  message0: "%1",
  args0: [
    {
      type: "field_dropdown",
      name: "BOOL",
      options: [
        ["HIGH", "HIGH"],
        ["LOW", "LOW"]
      ]
    }
  ],
  output: "Boolean",
  colour: 230,
  tooltip: "",
  helpUrl: "http://arduino.cc/en/Reference/Constants"
};

const servoMove = {
  type: "servo_move",
  message0: "Servo %1 PIN# %2 Degree (0~180) %3",
  args0: [
    {
      type: "field_image",
      src: "https://statics3.seeedstudio.com/images/product/EMAX%20Servo.jpg",
      width: 64,
      height: 64,
      alt: "Servo"
    },
    {
      type: "field_dropdown",
      name: "PIN",
      options: [
        ["0", "0"],
        ["1", "1"],
        ["2", "2"],
        ["3", "3"]
      ]
    },
    {
      type: "input_value",
      name: "DEGREE",
      check: "Number"
    }
  ],
  inputsInline: true,
  previousStatement: null,
  nextStatement: null,
  colour: 190,
  tooltip: "Move servo between 0~180 degree",
  helpUrl: "http://www.arduino.cc/playground/ComponentLib/servo"
};

const servoReadDegrees = {
  type: "servo_read_degrees",
  message0: "Servo %1 PIN# %2 Read Degrees",
  args0: [
    {
      type: "field_image",
      src: "https://statics3.seeedstudio.com/images/product/EMAX%20Servo.jpg",
      width: 64,
      height: 64,
      alt: "Servo"
    },
    {
      type: "field_dropdown",
      name: "PIN",
      options: [
        ["0", "0"],
        ["1", "1"],
        ["2", "2"],
        ["3", "3"]
      ]
    }
  ],
  output: "Number",
  colour: 190,
  tooltip: "Return the last moved servo degree",
  helpUrl: "http://www.arduino.cc/playground/ComponentLib/servo"
};

const serialPrint = {
  type: "serial_print",
  message0: "Serial Print %1",
  args0: [
    {
      type: "input_value",
      name: "CONTENT",
      check: "String"
    }
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 230,
  tooltip: "Print data to the console/serial port",
  helpUrl: "http://www.arduino.cc/en/Serial/Print"
};

// Colour blocks.

const COLOUR_HUE = 20;

const colourPicker = {
  type: 'colour_picker',
  message0: '%1',
  args0: [
    {
      type: 'field_colour',
      name: 'COLOUR',
      colour: '#ff0000'
    }
  ],
  output: 'Colour',
  colour: COLOUR_HUE,
  tooltip: 'Choose a colour',
  helpUrl: ''
};

const colourRandom = {
  type: 'colour_random',
  message0: 'random colour',
  output: 'Colour',
  colour: COLOUR_HUE,
  tooltip: 'Get a random colour',
  helpUrl: ''
};

const colourRGB = {
  type: 'colour_rgb',
  message0: 'colour with red %1 green %2 blue %3',
  args0: [
    {
      type: 'input_value',
      name: 'RED',
      check: 'Number'
    },
    {
      type: 'input_value',
      name: 'GREEN',
      check: 'Number'
    },
    {
      type: 'input_value',
      name: 'BLUE',
      check: 'Number'
    }
  ],
  output: 'Colour',
  colour: COLOUR_HUE,
  tooltip: 'Create a colour with the given RGB components (0-255).',
  helpUrl: ''
};

const colourBlend = {
  type: 'colour_blend',
  message0: 'blend colour %1 with colour %2 at ratio %3',
  args0: [
    {
      type: 'input_value',
      name: 'COLOUR1',
      check: 'Colour'
    },
    {
      type: 'input_value',
      name: 'COLOUR2',
      check: 'Colour'
    },
    {
      type: 'input_value',
      name: 'RATIO',
      check: 'Number'
    }
  ],
  output: 'Colour',
  colour: COLOUR_HUE,
  tooltip: 'Blend two colours together at the given ratio (0.0 - 1.0).',
  helpUrl: ''
};
// New block: millis
const millisBlock = {
  type: "millis",
  message0: "millis()",
  output: "Number",
  colour: 120,
  tooltip: "Returns the number of milliseconds since the program started.",
  helpUrl: "http://arduino.cc/en/Reference/Millis"
};

// New block: delayMicroseconds
const delayMicrosecondsBlock = {
  type: "delay_microseconds",
  message0: "delayMicroseconds %1",
  args0: [
    {
      type: "input_value",
      name: "DELAY_US",
      check: "Number"
    }
  ],
  inputsInline: true,
  previousStatement: null,
  nextStatement: null,
  colour: 120,
  tooltip: "Delay the program for a specified number of microseconds.",
  helpUrl: "http://arduino.cc/en/Reference/DelayMicroseconds"
};

// New block: Serial.println
const serialPrintln = {
  type: "serial_println",
  message0: "Serial.println %1",
  args0: [
    {
      type: "input_value",
      name: "CONTENT",
      check: "String"
    }
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 230,
  tooltip: "Print data to the serial port with a newline.",
  helpUrl: "http://www.arduino.cc/en/Serial/Println"
};
const controlsRepeat = {
  type: "controls_repeat",
  message0: "repeat %1 times",
  args0: [
    {
      type: "field_input",
      name: "TIMES",
      text: "10"
    }
  ],
  // Add these lines for the DO statement
  message1: "do %1",
  args1: [
    {
      type: "input_statement",
      name: "DO"
    }
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 120,
  tooltip: "Repeat a set of statements a specific number of times.",
  helpUrl: ""
};
const controlsRepeatExt = {
  type: "controls_repeat_ext",
  message0: "repeat %1 times",
  args0: [
    {
      type: "input_value",
      name: "TIMES",
      check: "Number"
    }
  ],
  // Add these lines for the DO statement
  message1: "do %1",
  args1: [
    {
      type: "input_statement",
      name: "DO"
    }
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 120,
  tooltip: "Repeat a set of statements a specific number of times.",
  helpUrl: ""
};

const controlsWhileUntil = {
  type: "controls_whileUntil",
  message0: "%1 %2",
  args0: [
    {
      type: "field_dropdown",
      name: "MODE",
      options: [
        ["while", "WHILE"],
        ["until", "UNTIL"]
      ]
    },
    {
      type: "input_value",
      name: "BOOL",
      check: "Boolean"
    }
  ],
  message1: "do %1",
  args1: [
    {
      type: "input_statement",
      name: "DO"
    }
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 120,
  tooltip: "Repeat while/until a condition is met.",
  helpUrl: ""
};

const controlsFor = {
  type: "controls_for",
  message0: "for %1 from %2 to %3 by %4",
  args0: [
    { type: "field_variable", name: "VAR", variable: "i" },
    { type: "input_value", name: "FROM", check: "Number" },
    { type: "input_value", name: "TO", check: "Number" },
    { type: "input_value", name: "BY", check: "Number" }
  ],
  // Add this section for the DO input
  message1: "do %1",
  args1: [{ type: "input_statement", name: "DO" }],
  inputsInline: true,
  previousStatement: null,
  nextStatement: null,
  colour: 120,
  tooltip: "Count from a start number to an end number by a given increment.",
  helpUrl: ""
};

const controlsForEach = {
  type: "controls_forEach",
  message0: "for each %1 in list %2",
  args0: [
    {
      type: "field_variable",
      name: "VAR",
      variable: "item"
    },
    {
      type: "input_value",
      name: "LIST",
      check: "Array"
    }
  ],
  // Add these lines for the DO statement
  message1: "do %1",
  args1: [
    {
      type: "input_statement",
      name: "DO"
    }
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 120,
  tooltip: "For each item in a list, do some statements.",
  helpUrl: ""
};

const controlsFlowStatements = {
  type: "controls_flow_statements",
  message0: "%1",
  args0: [
    {
      type: "field_dropdown",
      name: "FLOW",
      options: [
        ["break", "BREAK"],
        ["continue", "CONTINUE"]
      ]
    }
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 120,
  tooltip: "Break out of or continue a loop.",
  helpUrl: ""
};
const simulateLed = {
  type: "simulate_led",
  message0: "simulate LED %1",
  args0: [
    {
      type: "field_dropdown",
      name: "STATE",
      options: [
        ["HIGH", "HIGH"],
        ["LOW", "LOW"]
      ]
    }
  ],
  previousStatement: null,
  nextStatement: null,
  // Set an initial color (e.g., grey).
  colour: "#808080",
  tooltip: "Simulate LED output. If HIGH, the LED lights up; if LOW, it turns off.",
  helpUrl: "",
  // When the block changes, update its color based on the field value.
  onchange: function(this: Blockly.Block) {
    // Only update if the block is in a workspace.
    if (!this.workspace) return;
    const state = this.getFieldValue("STATE");
    if (state === "HIGH") {
      this.setColour("#FFD700"); // Gold for HIGH.
    } else {
      this.setColour("#808080"); // Grey for LOW.
    }
  }
};

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  simulateLed,

  addText,
  logText,
  inoutDigitalWrite,
  inoutDigitalRead,
  inoutAnalogWrite,
  inoutAnalogRead,
  inoutBuildinLed,
  inoutPinMode,
  baseDelay,
  baseMap,
  inoutTone,
  inoutNotone,
  inoutHighlow,
  servoMove,
  servoReadDegrees,
  serialPrint,
  colourPicker,
  logicIf,
  logicCompare,
  logicOperation,
  logicNegate,
  logicBoolean,
  logicNull,
  logicTernary,
  colourRandom,
  colourRGB,
  colourBlend,
  millisBlock,
  delayMicrosecondsBlock,
  serialPrintln,
  controlsRepeat,
  controlsRepeatExt,
  controlsWhileUntil,
  controlsFor,
  controlsForEach,
  controlsFlowStatements,
]);
