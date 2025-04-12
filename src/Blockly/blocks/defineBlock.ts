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
    colour: '#FFAB19',
    tooltip: 'Thêm văn bản vào chương trình',
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
    colour: '#FFAB19',
    tooltip: 'Ghi nội dung văn bản ra nhật ký (log)',
    helpUrl: '',
};

// 1. Integer Variable Declaration Block
const declareIntBlock = {
    type: "declare_int_variable",
    message0: "Int %1 = %2",
    args0: [
        {
            type: "field_input",
            name: "VAR_NAME",
            text: "myNumber"
        },
        {
            type: "input_value",
            name: "VALUE",
            check: "Number"
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#5CA699',
    tooltip: "Khai báo một biến số nguyên với giá trị ban đầu",
    helpUrl: ""
};

// 2. String Variable Declaration Block
const declareStringBlock = {
    type: "declare_string_variable",
    message0: "String %1 = %2",
    args0: [
        {
            type: "field_input",
            name: "VAR_NAME",
            text: "myText"
        },
        {
            type: "input_value",
            name: "VALUE",
            check: "String"
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#5CA699',
    tooltip: "Khai báo một biến chuỗi với giá trị ban đầu",
    helpUrl: ""
};

// 3. Float Variable Declaration Block
const declareFloatBlock = {
    type: "declare_float_variable",
    message0: "Double %1 = %2",
    args0: [
        {
            type: "field_input",
            name: "VAR_NAME",
            text: "myDecimal"
        },
        {
            type: "input_value",
            name: "VALUE",
            check: "Number"
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#5CA699',
    tooltip: "Khai báo một biến số thập phân với giá trị ban đầu",
    helpUrl: ""
};

// 4. Variable Assignment Block
const assignVariableBlock = {
    type: "assign_variable",
    message0: "Set %1 = %2",
    args0: [
        {
            type: "field_input",
            name: "VAR_NAME",
            text: "myVar"
        },
        {
            type: "input_value",
            name: "VALUE"
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#5C81A6',
    tooltip: "Gán giá trị mới cho biến đã tồn tại",
    helpUrl: ""
};

// 5. Print Variable Block
const printVariableBlock = {
    type: "print_variable",
    message0: "Print variable %1",
    args0: [
        {
            type: "field_input",
            name: "VAR_NAME",
            text: "myVar"
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#A65C81',
    tooltip: "In giá trị của biến ra màn hình",
    helpUrl: ""
};

// 6. Variable Value Block (to be used in expressions)
const variableValueBlock = {
    type: "variable_value",
    message0: "%1",
    args0: [
        {
            type: "field_input",
            name: "VAR_NAME",
            text: "myVar"
        }
    ],
    output: null,
    colour: '#A68E5C',
    tooltip: "Lấy giá trị của biến để sử dụng trong biểu thức",
    helpUrl: ""
};

// 7. Constant Declaration Block
const declareConstantBlock = {
    type: "declare_constant",
    message0: "Define constant %1 = %2",
    args0: [
        {
            type: "field_input",
            name: "CONST_NAME",
            text: "MAX_SIZE"
        },
        {
            type: "input_value",
            name: "VALUE"
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#A6735C',
    tooltip: "Khai báo một hằng số với giá trị không thể thay đổi",
    helpUrl: ""
};

// 8. Increment Variable Block
const incrementVariableBlock = {
    type: "increment_variable",
    message0: "Increase %1 by %2",
    args0: [
        {
            type: "field_input",
            name: "VAR_NAME",
            text: "counter"
        },
        {
            type: "input_value",
            name: "VALUE",
            check: "Number"
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#5C81A6',
    tooltip: "Tăng giá trị của biến lên một lượng nhất định",
    helpUrl: ""
};

// 9. Array Declaration Block
const declareArrayBlock = {
    type: "declare_array",
    message0: "Declare array %1 with size %2",
    args0: [
        {
            type: "field_input",
            name: "VAR_NAME",
            text: "myArray"
        },
        {
            type: "input_value",
            name: "SIZE",
            check: "Number"
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#5CA699',
    tooltip: "Khai báo một mảng với kích thước xác định",
    helpUrl: ""
};

// 10. Printf with Format Block
const printFormatBlock = {
    type: "print_format",
    message0: "Print with format: %1 variable: %2",
    args0: [
        {
            type: "field_dropdown",
            name: "FORMAT",
            options: [
                ["%d (integer)", "%d"],
                ["%f (decimal)", "%f"],
                ["%s (string)", "%s"],
                ["%c (character)", "%c"]
            ]
        },
        {
            type: "field_input",
            name: "VAR_NAME",
            text: "myVar"
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#A65C81',
    tooltip: "In giá trị của biến với định dạng cụ thể",
    helpUrl: ""
};
const printResultBlock = {
    type: 'print_result',
    message0: 'In ra %1',
    args0: [
        {
            type: 'input_value',
            name: 'VALUE',
        },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#FFAB19',
    tooltip: 'In giá trị ra màn hình Serial Monitor',
    helpUrl: '',
};

const inoutDigitalWrite = {
    type: "inout_digital_write",
    message0: "DigitalWrite PIN# %1 Stat %2",
    args0: [
        {
            type: "field_dropdown",
            name: "PIN",
            options: [
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
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
    colour: '#00979C',
    tooltip: "Gửi tín hiệu HIGH hoặc LOW đến một chân digital",
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
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
            ]
        }
    ],
    output: "Boolean",
    colour: '#00979C',
    tooltip: "Đọc tín hiệu digital (HIGH/LOW) từ một chân",
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
    previousStatement: null,
    nextStatement: null,
    colour: 210,
    tooltip: 'Nếu điều kiện đúng thì thực hiện hành động',
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
                ['≠', 'NEQ'],
                ['<', 'LT'],
                ['≤', 'LTE'],
                ['>', 'GT'],
                ['≥', 'GTE']
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
    tooltip: 'So sánh hai giá trị số',
    helpUrl: ''
};


const logicOperation = {
    type: 'logic_operation',
    message0: '%1 %2 %3',
    args0: [
        { type: 'input_value', name: 'A', check: 'Boolean' },
        { type: 'field_dropdown', name: 'OP', options: [['and', 'AND'], ['or', 'OR']] },
        { type: 'input_value', name: 'B', check: 'Boolean' }
    ],
    output: 'Boolean',
    colour: 210,
    tooltip: 'Kiểm tra 2 điều kiện đúng cùng lúc (và) hoặc 1 trong 2 đúng (hoặc)',
    helpUrl: ''
};

const logicNegate = {
    type: 'logic_negate',
    message0: 'not %1',
    args0: [
        { type: 'input_value', name: 'BOOL', check: 'Boolean' }
    ],
    output: 'Boolean',
    colour: 210,
    tooltip: 'Đảo ngược giá trị đúng/sai của điều kiện',
    helpUrl: ''
};

const logicBoolean = {
    type: 'logic_boolean',
    message0: '%1',
    args0: [
        { type: 'field_dropdown', name: 'BOOL', options: [['true', 'TRUE'], ['false', 'FALSE']] }
    ],
    output: 'Boolean',
    colour: 210,
    tooltip: 'Giá trị đúng hoặc sai (true/false)',
    helpUrl: ''
};

const logicNull = {
    type: 'logic_null',
    message0: 'null',
    output: null,
    colour: 210,
    tooltip: 'Không có giá trị (null)',
    helpUrl: ''
};

const logicTernary = {
    type: 'logic_ternary',
    message0: 'if %1 then %2 else %3',
    args0: [
        { type: 'input_value', name: 'IF', check: 'Boolean' },
        { type: 'input_value', name: 'THEN' },
        { type: 'input_value', name: 'ELSE' }
    ],
    output: null,
    colour: 210,
    tooltip: 'Chọn kết quả theo điều kiện đúng hay sai',
    helpUrl: ''
};

const inoutAnalogWrite = {
    type: "inout_analog_write",
    message0: "AnalogWrite PIN# %1 value %2",
    args0: [
        { type: "field_dropdown", name: "PIN", options: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]] },
        { type: "input_value", name: "NUM", check: "Number" }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#00979C',
    tooltip: "Gửi giá trị analog (0-255) đến chân được chọn",
    helpUrl: "http://arduino.cc/en/Reference/AnalogWrite"
};

const inoutAnalogRead = {
    type: "inout_analog_read",
    message0: "AnalogRead PIN# %1",
    args0: [
        { type: "field_dropdown", name: "PIN", options: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]] }
    ],
    output: "Number",
    colour: '#00979C',
    tooltip: "Đọc giá trị analog (0-1023) từ chân cảm biến",
    helpUrl: "http://arduino.cc/en/Reference/AnalogRead"
};

const inoutBuildinLed = {
    type: "inout_buildin_led",
    message0: "Build-in LED Stat %1",
    args0: [
        { type: "field_dropdown", name: "STAT", options: [["HIGH", "HIGH"], ["LOW", "LOW"]] }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#00979C',
    tooltip: "Bật hoặc tắt đèn LED có sẵn trên mạch",
    helpUrl: "http://arduino.cc/en/Reference/DigitalWrite"
};

// New block: Pin mode (set the mode of a pin)
const inoutPinMode = {
    type: "inout_pin_mode",
    message0: "Set pin %1 as %2",
    args0: [
        {
            type: "field_dropdown",
            name: "PIN",
            options: [
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
            ]
        },
        {
            type: "field_dropdown",
            name: "MODE",
            options: [
                ["input", "INPUT"],
                ["output", "OUTPUT"],
                ["input with pull-up", "INPUT_PULLUP"]
            ]
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#00979C',
    tooltip: "Chọn chế độ vào hoặc ra cho chân (PIN)",
    helpUrl: "http://arduino.cc/en/Reference/pinMode"
};

const baseDelay = {
    type: "base_delay",
    message0: "Wait %1 ms",
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
    colour: '#00979C',
    tooltip: "Dừng chương trình trong một khoảng thời gian (miligiây)",
    helpUrl: "http://arduino.cc/en/Reference/delay"
};

const baseMap = {
    type: "base_map",
    message0: "Convert %1 to range [0-%2]",
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
    output: null,
    colour: '#00979C',
    tooltip: "Chuyển một số từ khoảng 0-1024 sang khoảng khác",
    helpUrl: "http://arduino.cc/en/Reference/map"
};

const inoutTone = {
    type: "inout_tone",
    message0: "Play tone at pin %1 with frequency %2",
    args0: [
        {
            type: "field_dropdown",
            name: "PIN",
            options: [
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
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
    colour: '#00979C',
    tooltip: "Phát ra âm thanh tại chân được chọn với tần số xác định",
    helpUrl: "http://www.arduino.cc/en/Reference/Tone"
};

const inoutNotone = {
    type: "inout_notone",
    message0: "Stop tone at pin %1",
    args0: [
        {
            type: "field_dropdown",
            name: "PIN",
            options: [
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
            ]
        }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: '#00979C',
    tooltip: "Tắt âm thanh phát ra tại chân được chọn",
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
    colour: '#00979C',
    tooltip: "Giá trị HIGH (bật) hoặc LOW (tắt)",
    helpUrl: "http://arduino.cc/en/Reference/Constants"
};

const servoMove = {
    type: "servo_move",
    message0: "Move servo %1 at pin %2 to %3°",
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
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
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
    colour: '#ff65f3',
    tooltip: "Điều khiển servo quay từ 0 đến 180 độ",
    helpUrl: "http://www.arduino.cc/playground/ComponentLib/servo"
};

const servoReadDegrees = {
    type: "servo_read_degrees",
    message0: "Get angle of servo %1 at pin %2",
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
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
            ]
        }
    ],
    output: "Number",
    colour: '#ff65f3',
    tooltip: "Đọc góc quay hiện tại của servo (góc vừa điều khiển)",
    helpUrl: "http://www.arduino.cc/playground/ComponentLib/servo"
};

const serialPrint = {
    type: "serial_print",
    message0: "Serial print: %1",
    args0: [
        {
            type: "input_value",
            name: "CONTENT",
            check: "String"
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#00979C',
    tooltip: "Gửi dữ liệu ra màn hình Serial (giống như in ra để xem)",
    helpUrl: "http://www.arduino.cc/en/Serial/Print"
};

// Colour blocks

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
    tooltip: 'Chọn màu bất kỳ',
    helpUrl: ''
};

const colourRandom = {
    type: 'colour_random',
    message0: 'Random colour',
    output: 'Colour',
    colour: COLOUR_HUE,
    tooltip: 'Tạo một màu ngẫu nhiên',
    helpUrl: ''
};

const colourRGB = {
    type: 'colour_rgb',
    message0: 'Make colour with red %1 green %2 blue %3',
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
    tooltip: 'Tạo màu theo thành phần RGB (0-255)',
    helpUrl: ''
};

const colourBlend = {
    type: 'colour_blend',
    message0: 'Mix colour %1 and %2 with ratio %3',
    args0: [
        { type: 'input_value', name: 'COLOUR1', check: 'Colour' },
        { type: 'input_value', name: 'COLOUR2', check: 'Colour' },
        { type: 'input_value', name: 'RATIO', check: 'Number' }
    ],
    output: 'Colour',
    colour: COLOUR_HUE,
    tooltip: 'Trộn 2 màu lại với nhau theo tỉ lệ (0.0 đến 1.0)',
    helpUrl: ''
};

const millisBlock = {
    type: "millis",
    message0: "milliseconds passed",
    output: "Number",
    colour: '#00979C',
    tooltip: "Trả về số mili giây kể từ khi chương trình bắt đầu chạy",
    helpUrl: "http://arduino.cc/en/Reference/Millis"
};

const delayMicrosecondsBlock = {
    type: "delay_microseconds",
    message0: "wait %1 microseconds",
    args0: [
        { type: "input_value", name: "DELAY_US", check: "Number" }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: '#00979C',
    tooltip: "Dừng chương trình trong khoảng thời gian rất ngắn (micro giây)",
    helpUrl: "http://arduino.cc/en/Reference/DelayMicroseconds"
};

const serialPrintln = {
    type: "serial_println",
    message0: "Serial println %1",
    args0: [
        { type: "input_value", name: "CONTENT", check: "String" }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#00979C',
    tooltip: "In ra dữ liệu và xuống dòng trong màn hình Serial",
    helpUrl: "http://www.arduino.cc/en/Serial/Println"
};

const controlsRepeatExt = {
    type: "controls_repeat_ext",
    message0: "repeat %1 times",
    args0: [
        { type: "input_value", name: "TIMES", check: "Number" }
    ],
    message1: "do %1",
    args1: [
        { type: "input_statement", name: "DO" }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "Lặp lại các hành động bên trong nhiều lần",
    helpUrl: ""
};
const variableBlock = {
    type: "variable_declare",
    message0: "Khai báo biến %1 kiểu int",
    args0: [
        {
            type: "field_variable",
            name: "VAR",
            variable: "i"
        }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 330,
    tooltip: "Khai báo một biến kiểu int để sử dụng trong chương trình C",
    helpUrl: ""
};
const controlsFor = {
    type: "controls_for",
    message0: "count with %1 from %2 to %3 by %4",
    args0: [
        {
            type: "input_value",
            name: "VAR",
            check: "Variable"  // Kiểm tra đầu vào là một biến
        },
        { type: "input_value", name: "FROM", check: "Number" },
        { type: "input_value", name: "TO", check: "Number" },
        { type: "input_value", name: "BY", check: "Number" }
    ],
    message1: "do %1",
    args1: [
        { type: "input_statement", name: "DO" }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "Lặp lại từ số bắt đầu đến số kết thúc với bước nhảy. Sử dụng biến đã được khai báo từ trước.",
    helpUrl: ""
};

const controlsForEach = {
    type: "controls_forEach",
    message0: "for each %1 in list %2",
    args0: [
        { type: "field_variable", name: "VAR", variable: "item" },
        { type: "input_value", name: "LIST", check: "Array" }
    ],
    message1: "do %1",
    args1: [{ type: "input_statement", name: "DO" }],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "Lặp qua từng phần tử trong danh sách",
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
                ["stop loop", "BREAK"],
                ["skip to next", "CONTINUE"]
            ]
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "Dừng vòng lặp hoặc chuyển sang lần lặp tiếp theo",
    helpUrl: ""
};

const rgbLedControl = {
    type: "rgb_led_control",
    message0: "Setup RGB LED on pins\nR: %1 G: %2 B: %3\nwith values\nR: %4 G: %5 B: %6",
    args0: [
        {
            type: "field_dropdown",
            name: "RED_PIN",
            options: [
                ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
                ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]
            ]
        },
        {
            type: "field_dropdown",
            name: "GREEN_PIN",
            options: [
                ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
                ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]
            ]
        },
        {
            type: "field_dropdown",
            name: "BLUE_PIN",
            options: [
                ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
                ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]
            ]
        },
        {
            type: "field_number",
            name: "RED",
            value: 0,
            min: 0,
            max: 255,
            precision: 1
        },
        {
            type: "field_number",
            name: "GREEN",
            value: 0,
            min: 0,
            max: 255,
            precision: 1
        },
        {
            type: "field_number",
            name: "BLUE",
            value: 0,
            min: 0,
            max: 255,
            precision: 1
        }
    ],
    inputsInline: false,
    previousStatement: null,
    nextStatement: null,
    colour: '#FF6F00',
    tooltip: "Chuẩn bị đèn RGB với các thiết lập sẵn có để bắt đầu điều khiển.",
    helpUrl: ""
};
const rgbLedSetup = {
    type: "rgb_led_setup",
    message0: "Setup RGB LED on pins R:%1 G:%2 B:%3",
    args0: [
        {
            type: "field_dropdown",
            name: "RED_PIN",
            options: [
                ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
                ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]
            ]
        },
        {
            type: "field_dropdown",
            name: "GREEN_PIN",
            options: [
                ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
                ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]
            ]
        },
        {
            type: "field_dropdown",
            name: "BLUE_PIN",
            options: [
                ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
                ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]
            ]
        }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: '#FF6F00',
    tooltip: "Cài đặt đèn LED RGB bằng cách chọn chân kết nối cho đèn đỏ, xanh lá, và xanh dương",
    helpUrl: ""
};
const rgbLedSetColor = {
    type: "rgb_led_set_color",
    message0: "Set RGB LED color to R:%1 G:%2 B:%3",
    args0: [
        {
            type: "field_number",
            name: "RED",
            value: 0,
            min: 0,
            max: 255,
            precision: 1
        },
        {
            type: "field_number",
            name: "GREEN",
            value: 0,
            min: 0,
            max: 255,
            precision: 1
        },
        {
            type: "field_number",
            name: "BLUE",
            value: 0,
            min: 0,
            max: 255,
            precision: 1
        }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: '#FF6F00',
    tooltip: "Điều chỉnh màu sắc của đèn LED RGB bằng cách đặt giá trị (0-255) cho màu đỏ, xanh lá và xanh dương",
    helpUrl: ""
};
const rgbLedSetColorWithPins = {
    type: "rgb_led_set_color_with_pins",
    message0: "Set RGB LED on pins\nR: %1 G: %2 B: %3\nwith values\nR: %4 G: %5 B: %6",
    args0: [
        {
            type: "field_dropdown",
            name: "RED_PIN",
            options: [
                ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
                ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]
            ]
        },
        {
            type: "field_dropdown",
            name: "GREEN_PIN",
            options: [
                ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
                ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]
            ]
        },
        {
            type: "field_dropdown",
            name: "BLUE_PIN",
            options: [
                ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
                ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]
            ]
        },
        {
            type: "field_number",
            name: "RED",
            value: 0,
            min: 0,
            max: 255,
            precision: 1
        },
        {
            type: "field_number",
            name: "GREEN",
            value: 0,
            min: 0,
            max: 255,
            precision: 1
        },
        {
            type: "field_number",
            name: "BLUE",
            value: 0,
            min: 0,
            max: 255,
            precision: 1
        }
    ],
    inputsInline: false,
    previousStatement: null,
    nextStatement: null,
    colour: '#FF6F00',
    tooltip: "Điều chỉnh màu sắc của đèn LED RGB bằng cách chọn chân kết nối và đặt giá trị (0-255) cho màu đỏ, xanh lá và xanh dương",
    helpUrl: ""
};
const rgbLedVariableControl = {
    type: "rgb_led_variable_control",
    message0: "Setup RGB LED on pins\n R:%1 G:%2 B:%3 with values\n R:%4 G:%5 B:%6",
    args0: [
        {
            type: "input_value",
            name: "RED_PIN",
            check: ["Number", "String"]
        },
        {
            type: "input_value",
            name: "GREEN_PIN",
            check: ["Number", "String"]
        },
        {
            type: "input_value",
            name: "BLUE_PIN",
            check: ["Number", "String"]
        },
        {
            type: "input_value",
            name: "RED_VALUE",
            check: "Number"
        },
        {
            type: "input_value",
            name: "GREEN_VALUE",
            check: "Number"
        },
        {
            type: "input_value",
            name: "BLUE_VALUE",
            check: "Number"
        }
    ],
    inputsInline: false,
    previousStatement: null,
    nextStatement: null,
    colour: '#FF6F00',
    tooltip: "Điều khiển đèn LED RGB với chân và giá trị màu có thể được điều chỉnh bằng biến. Chân đèn có thể là 2-13 hoặc A0-A5, và giá trị màu từ 0-255.",
    helpUrl: ""
};
const rgbLedFixedPinVariableColor = {
    type: "rgb_led_fixed_pin_variable_color",
    message0: "Set RGB LED on pins\n R:%1 G:%2 B:%3 with variable colors\n R:%4 G:%5 B:%6",
    args0: [
        {
            type: "field_dropdown",
            name: "RED_PIN",
            options: [
                ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
                ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]
            ]
        },
        {
            type: "field_dropdown",
            name: "GREEN_PIN",
            options: [
                ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
                ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]
            ]
        },
        {
            type: "field_dropdown",
            name: "BLUE_PIN",
            options: [
                ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
                ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]
            ]
        },
        {
            type: "input_value",
            name: "RED_VALUE",
            check: "Number"
        },
        {
            type: "input_value",
            name: "GREEN_VALUE",
            check: "Number"
        },
        {
            type: "input_value",
            name: "BLUE_VALUE",
            check: "Number"
        }
    ],
    inputsInline: false,
    previousStatement: null,
    nextStatement: null,
    colour: '#FF6F00',
    tooltip: "Điều khiển đèn LED RGB với chân cố định nhưng giá trị màu có thể điều chỉnh bằng biến (0-255).",
    helpUrl: ""
};
const rgbLedVariableInfo = {
    type: "rgb_led_variable_info",
    message0: "Thông tin về đèn RGB %1 %2 Chân: 2-13, A0-A5 %3 Màu: 0-255",
    args0: [
        {
            type: "input_dummy"
        },
        {
            type: "input_dummy"
        },
        {
            type: "input_dummy"
        }
    ],
    colour: '#FF6F00',
    tooltip: "Thông tin về phạm vi giá trị hợp lệ cho chân và màu của đèn RGB",
    helpUrl: ""
};
const simulateLed = {
    type: "simulate_led",
    message0: "LED on pin %1 set to %2",
    args0: [
        {
            type: "input_value",
            name: "PIN",
            check: "Number"
        },
        {
            type: "field_dropdown",
            name: "STATE",
            options: [
                ["ON", "HIGH"],
                ["OFF", "LOW"]
            ]
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#FF6F00',
    tooltip: "Set LED state (ON/OFF) on specified pin",
    helpUrl: "",
    onchange: function(this: Blockly.Block) {
        if (!this.workspace) return;
        const state = this.getFieldValue("STATE");
        this.setColour(state === "HIGH" ? "#FFD700" : "#808080");
    }
};
const dhtSensor = {
    type: "dht_sensor",
    message0: "DHT%1 sensor on pin %2 read %3",
    args0: [
        {
            type: "field_dropdown",
            name: "TYPE",
            options: [
                ["11", "DHT11"],
                ["22", "DHT22"]
            ]
        },
        { type: "input_value", name: "PIN", check: "Number" },
        {
            type: "field_dropdown",
            name: "READING",
            options: [
                ["temperature", "TEMPERATURE"],
                ["humidity", "HUMIDITY"]
            ]
        }
    ],
    output: "Number",
    colour: '#FF6F00',
    tooltip: "Read temperature or humidity from DHT sensor",
    helpUrl: ""
};
const ultrasonicSensor = {
    type: "ultrasonic_sensor",
    message0: "distance from ultrasonic (cm) TRIG: %1 ECHO: %2",
    args0: [
        {
            type: "field_dropdown",
            name: "TRIG_PIN",
            options: [
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
            ]
        },
        {
            type: "field_dropdown",
            name: "ECHO_PIN",
            options: [
                ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]
            ]}
    ],
    output: "Number",
    colour: '#FF6F00',
    tooltip: "Đo khoảng cách bằng cảm biến siêu âm HC-SR04",
    helpUrl: ""
};
const dcMotorControl = {
    type: "dc_motor_control",
    message0: "Set DC motor PIN1: %1 PIN2: %2 direction: %3 speed: %4",
    args0: [
        { type: "field_dropdown", name: "PIN1", options: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]] },
        { type: "field_dropdown", name: "PIN2", options: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]] },
        { type: "field_dropdown", name: "DIRECTION", options: [["Forward", "FORWARD"], ["Backward", "BACKWARD"], ["Stop", "STOP"]] },
        { type: "input_value", name: "SPEED", check: "Number" }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: '#FF6F00',
    tooltip: "Điều khiển chiều quay và tốc độ của động cơ DC (tốc độ từ 0 đến 255)",
    helpUrl: ""
};

const lightSensor = {
    type: "light_sensor",
    message0: "Read light level from LDR at PIN %1",
    args0: [
        { type: "field_dropdown", name: "PIN", options: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]] }
    ],
    output: "Number",
    colour: '#FF6F00',
    tooltip: "Đọc giá trị ánh sáng từ cảm biến quang trở (LDR)",
    helpUrl: ""
};

const pirMotionSensor = {
    type: "pir_motion_sensor",
    message0: "PIR motion detected at PIN %1",
    args0: [
        { type: "field_dropdown", name: "PIN", options: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]] }
    ],
    output: "Boolean",
    colour: '#FF6F00',
    tooltip: "Phát hiện chuyển động bằng cảm biến PIR (trả về đúng/sai)",
    helpUrl: ""
};

const debouncedButton = {
    type: "debounced_button",
    message0: "Button at PIN %1 pressed? (debounce %2 ms)",
    args0: [
        { type: "field_dropdown", name: "PIN", options: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
                ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
                ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
                ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"],
                ["A4", "A4"], ["A5", "A5"]] },
        { type: "input_value", name: "DEBOUNCE_TIME", check: "Number" }
    ],
    output: "Boolean",
    colour: '#FF6F00',
    tooltip: "Đọc trạng thái nút nhấn với thời gian chống nhiễu (debounce)",
    helpUrl: ""
};

const stepperMotorControl = {
    type: "stepper_motor_control",
    message0: "Move stepper motor %1 steps at speed %2",
    args0: [
        { type: "input_value", name: "STEPS", check: "Number" },
        { type: "input_value", name: "SPEED", check: "Number" }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: '#FF6F00',
    tooltip: "Điều khiển motor bước (dương: quay phải, âm: quay trái)",
    helpUrl: ""
};

// 10. Khối thiết lập Serial
const serialBegin = {
    type: "serial_begin",
    message0: "Start Serial at %1 baud",
    args0: [
        {
            type: "field_dropdown",
            name: "BAUD_RATE",
            options: [
                ["9600", "9600"],
                ["19200", "19200"],
                ["38400", "38400"],
                ["57600", "57600"],
                ["115200", "115200"]
            ]
        }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: '#00979C',
    tooltip: "Bắt đầu giao tiếp Serial với tốc độ baud đã chọn",
    helpUrl: "http://arduino.cc/en/Serial/Begin"
};

const mapExtended = {
    type: "map_extended",
    message0: "Map %1 from [%2 - %3] to [%4 - %5]",
    args0: [
        { type: "input_value", name: "VALUE", check: "Number" },
        { type: "input_value", name: "FROM_LOW", check: "Number" },
        { type: "input_value", name: "FROM_HIGH", check: "Number" },
        { type: "input_value", name: "TO_LOW", check: "Number" },
        { type: "input_value", name: "TO_HIGH", check: "Number" }
    ],
    inputsInline: true,
    output: "Number",
    colour: '#00979C',
    tooltip: "Chuyển đổi giá trị từ khoảng này sang khoảng khác (hàm map)",
    helpUrl: "http://arduino.cc/en/Reference/Map"
};

const waitUntil = {
    type: "wait_until",
    message0: "Wait until %1 is true",
    args0: [
        { type: "input_value", name: "CONDITION", check: "Boolean" }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#00979C',
    tooltip: "Dừng lại và đợi cho đến khi điều kiện đúng",
    helpUrl: ""
};

const setup = {
    type: "setup",
    message0: "When program starts",
    message1: "%1",
    args1: [
        { type: "input_statement", name: "SETUP_CODE" }
    ],
    colour: '#00979C',
    tooltip: "Chạy một lần duy nhất khi bắt đầu chương trình",
    helpUrl: ""
};

const loop = {
    type: "loop",
    message0: "Repeat forever",
    message1: "%1",
    args1: [
        { type: "input_statement", name: "LOOP_CODE" }
    ],
    colour: '#00979C',
    tooltip: "Lặp lại mã này liên tục",
    helpUrl: ""
};

const servoRotate = {
    type: "servo_rotate",
    message0: "Rotate servo at PIN %1 to angle %2",
    args0: [
        { type: "input_value", name: "SERVO_PIN", check: "Number" },
        { type: "input_value", name: "ANGLE", check: "Number" }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#ff65f3',
    tooltip: "Xoay servo đến góc chỉ định (từ 0 đến 180 độ)",
    helpUrl: ""
};

// Block: Servo setup
const servoSetup = {
    type: 'servo_setup',
    message0: 'Setup servo at pin %1',
    args0: [
        {
            type: 'input_value',
            name: 'SERVO_PIN',
            check: 'Number',
        },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#ff65f3',
    tooltip: 'Chuẩn bị để dùng servo tại chân được chọn',
    helpUrl: '',
};
const functionWrapper = {
    type: "function_wrapper",
    message0: "Function Container %1 %2",
    args0: [
        {
            type: "input_dummy"
        },
        {
            type: "input_statement",
            name: "FUNCTIONS",
            check: "function_input"  // Xác định loại khối có thể kết nối
        }
    ],
    colour: 290,
    tooltip: "Khối bao bọc các hàm (function) để giúp học sinh hiểu được thứ tự thực thi của mã. Các hàm bên trong sẽ được định nghĩa trước khi chương trình chính chạy.",
    helpUrl: ""
};
const functionDefinition = {
    type: "function_definition",
    message0: "Define function %1 %2 with parameters %3 %4",
    args0: [
        {
            type: "field_input",
            name: "NAME",
            text: "myFunction"
        },
        {
            type: "input_dummy"
        },
        {
            type: "field_input",
            name: "PARAMS",
            text: ""
        },
        {
            type: "input_statement",
            name: "STACK"
        }
    ],
    output: null,  // Loại bỏ output
    previousStatement: "function_input",  // Cho phép kết nối với function_wrapper
    nextStatement: "function_input",  // Cho phép kết nối với các function khác
    colour: 290,
    tooltip: "Định nghĩa một hàm với tên và tham số. Hàm này có thể được gọi từ các khối khác trong chương trình.",
    helpUrl: ""
};
const codeTextBlock = {
    type: "code_text",
    message0: "Code C: %1",
    args0: [
        {
            type: "field_input",
            name: "CODE_TEXT",
            text: "// Viết mã C ở đây"
        }
    ],
    output: null, // Cho phép gắn ở mọi nơi
    colour: 65,
    tooltip: "Nhập mã C tùy chỉnh vào đây",
    helpUrl: ""
};
// Định nghĩa khối custom code nhận khối text code
const customCodeBlock = {
    type: "custom_code_block",
    message0: "Custom Code: %1",
    args0: [
        {
            type: "field_input",
            name: "CODE_TEXT",
            text: "// Viết mã C ở đây"
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: "Thêm mã C tùy chỉnh vào chương trình chính",
    helpUrl: ""
};


// Định nghĩa khối custom function nhận khối text code
const customFunctionBlock = {
    type: "custom_function_block",
    message0: "Custom Function %1",
    args0: [
        {
            type: "input_value",
            name: "FUNCTION_CODE",
            check: "String"
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 290,
    tooltip: "Định nghĩa một hàm C tùy chỉnh",
    helpUrl: ""
};
const functionCall = {
    type: "function_call",
    message0: "Call function %1 with params %2",
    args0: [
        {
            type: "field_input",
            name: "NAME",
            text: "myFunction"
        },
        {
            type: "field_input",
            name: "PARAMS",
            text: ""
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 290,
    tooltip: "Gọi một hàm đã được định nghĩa với các tham số.",
    helpUrl: ""
};

//LCD
const lcdInstructionBlock = {
    type: "lcd_instruction_block",
    message0: "%1 %2 Cách nối LCD 16x2 (không I2C):\nRS → chân 12\nE → chân 11\nD4 → chân 5\nD5 → chân 4\nD6 → chân 3\nD7 → chân 2\n\nDùng điện trở 10k để chỉnh độ tương phản.",
    args0: [
        {
            type: "field_image",
            name: "LCD_IMAGE",
            src: "https://lh3.googleusercontent.com/proxy/_c5wnfW1jIaCCQNd3mVOvTHZWbqXhEJn7SE8CsoTFHEGKae_A0gJI4kkiYD_zzeCeXq49sg2gBovtf16SZriDj-Lb93ip3FC9elHjiiF_qpI3iTSOKdybIXUpszQ", // <- THAY BẰNG LINK ẢNH CỦA BẠN
            width: 300,
            height: 150,
            alt: "*"
        },
        {
            type: "input_dummy"
        }
    ],
    colour: "#00ACC1",
    tooltip: "Hướng dẫn cách đấu nối LCD 16x2 loại thường (không dùng I2C)",
    helpUrl: "http://arduino.vn/bai-viet/531-dieu-khien-lcd-bang-arduino-uno"
};

const lcdInitBlock = {
    type: 'lcd_init',
    message0: 'Initialize LCD (no I2C) with pins\n RS %1 E %2 D4 %3 D5 %4 D6 %5 D7 %6',
    args0: [
        {
            type: 'field_dropdown',
            name: 'RS',
            options: [
                ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
                ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'],
                ['10', '10'], ['11', '11'], ['12', '12'], ['13', '13']
            ]
        },
        {
            type: 'field_dropdown',
            name: 'E',
            options: [
                ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
                ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'],
                ['10', '10'], ['11', '11'], ['12', '12'], ['13', '13']
            ]
        },
        {
            type: 'field_dropdown',
            name: 'D4',
            options: [
                ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
                ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'],
                ['10', '10'], ['11', '11'], ['12', '12'], ['13', '13']
            ]
        },
        {
            type: 'field_dropdown',
            name: 'D5',
            options: [
                ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
                ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'],
                ['10', '10'], ['11', '11'], ['12', '12'], ['13', '13']
            ]
        },
        {
            type: 'field_dropdown',
            name: 'D6',
            options: [
                ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
                ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'],
                ['10', '10'], ['11', '11'], ['12', '12'], ['13', '13']
            ]
        },
        {
            type: 'field_dropdown',
            name: 'D7',
            options: [
                ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
                ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'],
                ['10', '10'], ['11', '11'], ['12', '12'], ['13', '13']
            ]
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#00BFFF',
    tooltip: 'Khởi tạo màn hình LCD thường – 16x2 (không dùng I2C)',
    helpUrl: ''
};

const lcdClearBlock = {
    type: 'lcd_clear',
    message0: 'Clear LCD screen',
    previousStatement: null,
    nextStatement: null,
    colour: '#00BFFF',
    tooltip: 'Xóa nội dung trên màn hình LCD',
    helpUrl: ''
};

const lcdPrintBlock = {
    type: 'lcd_print',
    message0: 'Print text %1 at position: \nrow %2 column %3',
    args0: [
        {
            type: 'field_input',
            name: 'TEXT',
            text: 'Hello World!'
        },
        {
            type: 'field_dropdown',
            name: 'ROW',
            options: [
                ['0', '0'],
                ['1', '1'],
                ['2', '2'],
                ['3', '3']
            ]
        },
        {
            type: 'field_dropdown',
            name: 'COL',
            options: [
                ['0', '0'],
                ['1', '1'],
                ['2', '2'],
                ['3', '3'],
                ['4', '4'],
                ['5', '5'],
                ['6', '6'],
                ['7', '7'],
                ['8', '8'],
                ['9', '9'],
                ['10', '10'],
                ['11', '11'],
                ['12', '12'],
                ['13', '13'],
                ['14', '14'],
                ['15', '15']
            ]
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#00BFFF',
    tooltip: 'Hiển thị văn bản tại vị trí cụ thể trên màn hình LCD',
    helpUrl: ''
};

const lcdSetCursorBlock = {
    type: 'lcd_set_cursor',
    message0: 'Set cursor to row %1 column %2',
    args0: [
        {
            type: 'field_dropdown',
            name: 'ROW',
            options: [
                ['0', '0'],
                ['1', '1'],
                ['2', '2'],
                ['3', '3']
            ]
        },
        {
            type: 'field_dropdown',
            name: 'COL',
            options: [
                ['0', '0'],
                ['1', '1'],
                ['2', '2'],
                ['3', '3'],
                ['4', '4'],
                ['5', '5'],
                ['6', '6'],
                ['7', '7'],
                ['8', '8'],
                ['9', '9'],
                ['10', '10'],
                ['11', '11'],
                ['12', '12'],
                ['13', '13'],
                ['14', '14'],
                ['15', '15']
            ]
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#00BFFF',
    tooltip: 'Di chuyển con trỏ đến vị trí cụ thể trên màn hình LCD',
    helpUrl: ''
};

const lcdCreateCharBlock = {
    type: 'lcd_create_char',
    message0: 'Create custom char at position %1\n with pattern %2',
    args0: [
        {
            type: 'field_dropdown',
            name: 'POS',
            options: [
                ['0', '0'],
                ['1', '1'],
                ['2', '2'],
                ['3', '3'],
                ['4', '4'],
                ['5', '5'],
                ['6', '6'],
                ['7', '7']
            ]
        },
        {
            type: 'field_input',
            name: 'PATTERN',
            text: '{0x00, 0x0A, 0x15, 0x11, 0x11, 0x0A, 0x04, 0x00}'
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#00BFFF',
    tooltip: 'Tạo một ký tự tùy chỉnh cho màn hình LCD',
    helpUrl: ''
};

const lcdBacklightBlock = {
    type: 'lcd_backlight',
    message0: 'Set LCD backlight %1',
    args0: [
        {
            type: 'field_dropdown',
            name: 'STATE',
            options: [
                ['ON', 'ON'],
                ['OFF', 'OFF']
            ]
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#00BFFF',
    tooltip: 'Bật hoặc tắt đèn nền cho màn hình LCD',
    helpUrl: ''
};

const lcdDisplayBlock = {
    type: 'lcd_display',
    message0: 'Set LCD display %1',
    args0: [
        {
            type: 'field_dropdown',
            name: 'STATE',
            options: [
                ['ON', 'ON'],
                ['OFF', 'OFF']
            ]
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#00BFFF',
    tooltip: 'Bật hoặc tắt hiển thị màn hình LCD',
    helpUrl: ''
};

const lcdPrintCustomCharBlock = {
    type: 'lcd_print_custom_char',
    message0: 'Print custom char at position %1',
    args0: [
        {
            type: 'field_dropdown',
            name: 'POS',
            options: [
                ['0', '0'],
                ['1', '1'],
                ['2', '2'],
                ['3', '3'],
                ['4', '4'],
                ['5', '5'],
                ['6', '6'],
                ['7', '7']
            ]
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#00BFFF',
    tooltip: 'Hiển thị ký tự tùy chỉnh đã tạo trước đó',
    helpUrl: ''
};

//Button block
// Button Press and Hold Block
const buttonPressHold = {
    type: 'button_press_hold',
    message0: 'When button on pin %1 is pressed %2 do %3',
    args0: [
        {
            type: 'input_value',
            name: 'PIN',
            check: 'Number',
        },
        {
            type: 'input_dummy'
        },
        {
            type: 'input_statement',
            name: 'DO',
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#4C97FF', // Blue color for input control
    tooltip: 'Thực hiện hành động khi nút được nhấn giữ, dừng hành động khi thả nút',
    helpUrl: '',
};

// Toggle Button Block
const buttonToggle = {
    type: 'button_toggle',
    message0: 'Toggle when button on pin %1 is pressed %2 ON action %3 OFF action %4',
    args0: [
        {
            type: 'input_value',
            name: 'PIN',
            check: 'Number',
        },
        {
            type: 'input_dummy'
        },
        {
            type: 'input_statement',
            name: 'ON_ACTION',
        },
        {
            type: 'input_statement',
            name: 'OFF_ACTION',
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#5BA55B', // Green color for toggle functionality
    tooltip: 'Chuyển đổi trạng thái mỗi khi nút được nhấn, lần đầu ON, lần sau OFF',
    helpUrl: '',
};

// Long Press Button Block
const buttonLongPress = {
    type: 'button_long_press',
    message0: 'Button on pin %1 long press time %2 ms %3 short press action %4 long press action %5',
    args0: [
        {
            type: 'input_value',
            name: 'PIN',
            check: 'Number',
        },
        {
            type: 'input_value',
            name: 'TIME',
            check: 'Number',
        },
        {
            type: 'input_dummy'
        },
        {
            type: 'input_statement',
            name: 'SHORT_PRESS',
        },
        {
            type: 'input_statement',
            name: 'LONG_PRESS',
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#A55B80', // Purple for advanced functionality
    tooltip: 'Thực hiện hành động khác nhau dựa vào thời gian nhấn giữ nút',
    helpUrl: '',
};

// Multi-Press Button Block
const buttonMultiPress = {
    type: 'button_multi_press',
    message0: 'Count presses on pin %1 reset after %2 ms %3 on press #1 %4 on press #2 %5 on press #3 %6',
    args0: [
        {
            type: 'input_value',
            name: 'PIN',
            check: 'Number',
        },
        {
            type: 'input_value',
            name: 'TIMEOUT',
            check: 'Number',
        },
        {
            type: 'input_dummy'
        },
        {
            type: 'input_statement',
            name: 'PRESS1',
        },
        {
            type: 'input_statement',
            name: 'PRESS2',
        },
        {
            type: 'input_statement',
            name: 'PRESS3',
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#DA8E3B', // Orange for counting functionality
    tooltip: 'Đếm số lần nhấn nút và thực hiện các hành động tương ứng',
    helpUrl: '',
};

// Directional Control Buttons Block
const buttonDirectional = {
    type: 'button_directional',
    message0: 'Directional control with buttons %1 Up pin %2 Down pin %3 Left pin %4 Right pin %5 %6 When pressed do %7',
    args0: [
        {
            type: 'input_dummy'
        },
        {
            type: 'input_value',
            name: 'UP_PIN',
            check: 'Number',
        },
        {
            type: 'input_value',
            name: 'DOWN_PIN',
            check: 'Number',
        },
        {
            type: 'input_value',
            name: 'LEFT_PIN',
            check: 'Number',
        },
        {
            type: 'input_value',
            name: 'RIGHT_PIN',
            check: 'Number',
        },
        {
            type: 'input_dummy'
        },
        {
            type: 'input_statement',
            name: 'ACTIONS',
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#5B67A5', // Blue-violet for navigation
    tooltip: 'Thiết lập các nút điều hướng để di chuyển (lên, xuống, trái, phải)',
    helpUrl: '',
};

// LCD/OLED Menu Navigation Block
const buttonLCDMenu = {
    type: 'button_lcd_menu',
    message0: 'LCD menu with %1 pages %2 Next button pin %3 Select button pin %4 %5 On page change %6 On selection %7',
    args0: [
        {
            type: 'input_value',
            name: 'PAGES',
            check: 'Number',
        },
        {
            type: 'input_dummy'
        },
        {
            type: 'input_value',
            name: 'NEXT_PIN',
            check: 'Number',
        },
        {
            type: 'input_value',
            name: 'SELECT_PIN',
            check: 'Number',
        },
        {
            type: 'input_dummy'
        },
        {
            type: 'input_statement',
            name: 'PAGE_CHANGE',
        },
        {
            type: 'input_statement',
            name: 'SELECTION',
        }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#31AE27', // Green for display functionality
    tooltip: 'Tạo menu trên LCD/OLED với hai nút: nút chuyển trang và nút chọn chức năng',
    helpUrl: '',
};
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  simulateLed,
    setup,
    loop,
  addText,
  logText,
    declareIntBlock,
    declareStringBlock,
    declareFloatBlock,
    assignVariableBlock,
    printVariableBlock,
    variableValueBlock,
    declareConstantBlock,
    incrementVariableBlock,
    printResultBlock,
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
  // controlsRepeat,
  controlsRepeatExt,
  // controlsWhileUntil,
    variableBlock,
  controlsFor,
  controlsForEach,
  controlsFlowStatements,

    rgbLedControl,
    rgbLedSetup,
    rgbLedSetColor,
    rgbLedSetColorWithPins,
    rgbLedVariableControl,
    rgbLedVariableInfo,
    rgbLedFixedPinVariableColor,
    dhtSensor,
    ultrasonicSensor,
    dcMotorControl,
    lightSensor,
    pirMotionSensor,
    debouncedButton,
    stepperMotorControl,
    serialBegin,
    mapExtended,
    waitUntil,
    servoRotate,
    servoSetup,
    functionWrapper,
    functionDefinition,
    customFunctionBlock,
    codeTextBlock,
    functionCall,
    customCodeBlock,

    lcdInstructionBlock,
    lcdInitBlock,
    lcdClearBlock,
    lcdPrintBlock,
    lcdSetCursorBlock,
    lcdCreateCharBlock,
    lcdBacklightBlock,
    lcdDisplayBlock,
    lcdPrintCustomCharBlock,

    buttonPressHold,
    buttonToggle,
    buttonLongPress,
    buttonMultiPress,
    buttonDirectional,
    buttonLCDMenu,
]);
