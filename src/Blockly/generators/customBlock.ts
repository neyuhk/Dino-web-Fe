import { Order } from 'blockly/javascript';
import * as Blockly from 'blockly/core';

export const forBlock = Object.create(null);
const C = new Blockly.Generator('C');
const simulateLED = (state: string) => {
    const ledElement = document.getElementById('simulated-led');
    if (ledElement) {
        ledElement.style.backgroundColor = state === 'HIGH' ? 'yellow' : 'black';
    }
    console.log('LED state:', state);
};

// Existing custom block generators.
forBlock['add_text'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const text = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";
  const addText = generator.provideFunction_(
    'addText',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(text) {
  const outputDiv = document.getElementById('output');
  const textEl = document.createElement('p');
  textEl.innerText = text;
  outputDiv.appendChild(textEl);
}`,
  );
  return `${addText}(${text});\n`;
};

forBlock['log_text'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const text = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";
  return `console.log(${text});\n`;
};

// Arduino block generators.

// base_delay: Delay block.
forBlock['base_delay'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const delayTime = generator.valueToCode(block, 'DELAY_TIME', Order.NONE) || '0';
  return `delay(${delayTime});\n`;
};

forBlock['print_result'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const value = generator.valueToCode(block, 'VALUE', Order.NONE) || "''";
    const printFunction = generator.provideFunction_(
        'printResult',
        `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(text) {
  const outputDiv = document.getElementById('output');
  const el = document.createElement('p');
  el.innerText = text;
  outputDiv.appendChild(el);
}`
    );
    return `${printFunction}(${value});\n`;
};


// base_map: Map block.
forBlock['base_map'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const num = generator.valueToCode(block, 'NUM', Order.NONE) || '0';
  const dmax = generator.valueToCode(block, 'DMAX', Order.NONE) || '0';
  return [`map(${num}, 0, 1024, 0, ${dmax})`, Order.ATOMIC];
};

// inout_tone: Tone block.
forBlock['inout_tone'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const pin = block.getFieldValue('PIN');
  const frequency = generator.valueToCode(block, 'NUM', Order.NONE) || '0';
  return `tone(${pin}, ${frequency});\n`;
};

// inout_notone: No tone block.
forBlock['inout_notone'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const pin = block.getFieldValue('PIN');
  return `noTone(${pin});\n`;
};

// inout_highlow: HIGH/LOW constant block.
forBlock['inout_highlow'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const boolVal = block.getFieldValue('BOOL');
  return [boolVal, Order.ATOMIC];
};

// servo_move: Servo move block.
forBlock['servo_move'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const pin = block.getFieldValue('PIN');
  const degree = generator.valueToCode(block, 'DEGREE', Order.NONE) || '0';
  return `servoMove(${pin}, ${degree});\n`;
};

// servo_read_degrees: Servo read degrees block.
forBlock['servo_read_degrees'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const pin = block.getFieldValue('PIN');
  return [`servoReadDegrees(${pin})`, Order.ATOMIC];
};

// serial_print: Serial print block.
forBlock['serial_print'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const content = generator.valueToCode(block, 'CONTENT', Order.NONE) || "''";
  return `Serial.print(${content});\n`;
};

// inout_digital_write: Digital Write block.
forBlock['inout_digital_write'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const pin = block.getFieldValue('PIN');
  const stat = block.getFieldValue('STAT');
  return `digitalWrite(${pin}, ${stat});\n`;
};

// inout_digital_read: Digital Read block.
forBlock['inout_digital_read'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const pin = block.getFieldValue('PIN');
  const code = `digitalRead(${pin})`;
  return [code, Order.ATOMIC];
};

// inout_analog_write: Analog Write block.
forBlock['inout_analog_write'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const pin = block.getFieldValue('PIN');
  const value = generator.valueToCode(block, 'NUM', Order.NONE) || '0';
  return `analogWrite(${pin}, ${value});\n`;
};

// inout_analog_read: Analog Read block.
forBlock['inout_analog_read'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const pin = block.getFieldValue('PIN');
  const code = `analogRead(${pin})`;
  return [code, Order.ATOMIC];
};

// inout_buildin_led: Build-in LED block.
forBlock['inout_buildin_led'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const stat = block.getFieldValue('STAT');
  return `digitalWrite(LED_BUILTIN, ${stat});\n`;
};

// inout_pin_mode: Pin mode block.
forBlock['inout_pin_mode'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const pin = block.getFieldValue('PIN');
  const mode = block.getFieldValue('MODE');
  return `pinMode(${pin}, ${mode});\n`;
};

// Colour blocks generators.

// Generator for the colour picker block.
forBlock['colour_picker'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  const colour = block.getFieldValue('COLOUR');
  return [`'${colour}'`, Order.ATOMIC];
};

const ORDER_ATOMIC = 0;

forBlock['colour_random'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator
) {
    const code = 'rand() % 256';
    return [code, ORDER_ATOMIC];
};

// Generator for the colour RGB block.
forBlock['colour_rgb'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  const r = generator.valueToCode(block, 'RED', Order.NONE) || '0';
  const g = generator.valueToCode(block, 'GREEN', Order.NONE) || '0';
  const b = generator.valueToCode(block, 'BLUE', Order.NONE) || '0';
  const code = `rgbToHex(${r}, ${g}, ${b})`;
  return [code, Order.ATOMIC];
};

// Generator for the colour blend block.
forBlock['colour_blend'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  const colour1 = generator.valueToCode(block, 'COLOUR1', Order.NONE) || '\'#000000\'';
  const colour2 = generator.valueToCode(block, 'COLOUR2', Order.NONE) || '\'#000000\'';
  const ratio = generator.valueToCode(block, 'RATIO', Order.NONE) || '0';
  const code = `blendColour(${colour1}, ${colour2}, ${ratio})`;
  return [code, Order.ATOMIC];
};
forBlock['millis'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  // For simulation, you could use performance.now() or a global simulation clock.
  // Here we use performance.now() as an example.
  return [`Math.floor(performance.now())`, Order.ATOMIC];
};

// New generator: delayMicroseconds block.
forBlock['delay_microseconds'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const delayUS = generator.valueToCode(block, 'DELAY_US', Order.NONE) || '0';
  // In a simulation, a microsecond delay might not be noticeable.
  // For simulation purposes, you could simply call a function or log the delay.
  return `delayMicroseconds(${delayUS});\n`;
};

// New generator: Serial.println block.
forBlock['serial_println'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const content = generator.valueToCode(block, 'CONTENT', Order.NONE) || "''";
  return `Serial.println(${content});\n`;
};
// Generator for the "if" block.
forBlock['controls_if'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  // In this simplified version, we assume only one condition and one branch.
  const condition = generator.valueToCode(block, 'IF0', Order.NONE) || '0';
  const branch = generator.statementToCode(block, 'DO0');
  const code = 'if (' + condition + ') {\n' + branch + '}\n';
  return code;
};

// Generator for logic_compare.
forBlock['logic_compare'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const OPERATORS: { [key: string]: string } = {
    EQ: '==',
    NEQ: '!=',
    LT: '<',
    LTE: '<=',
    GT: '>',
    GTE: '>='
  };
  const operator = OPERATORS[block.getFieldValue('OP')];
  const order = (operator === '==' || operator === '!=') ? Order.EQUALITY : Order.RELATIONAL;
  const argument0 = generator.valueToCode(block, 'A', order) || '0';
  const argument1 = generator.valueToCode(block, 'B', order) || '0';
  const code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

// Generator for logic_operation.
forBlock['logic_operation'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const operator = block.getFieldValue('OP') === 'AND' ? '&&' : '||';
  const order = operator === '&&' ? Order.LOGICAL_AND : Order.LOGICAL_OR;
  const argument0 = generator.valueToCode(block, 'A', order) || 'false';
  const argument1 = generator.valueToCode(block, 'B', order) || 'false';
  const code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};
const ORDER_UNARY_PREFIX = 7;

// Generator for logic_negate.
forBlock['logic_negate'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const order = ORDER_UNARY_PREFIX;
  const argument0 = generator.valueToCode(block, 'BOOL', order) || 'false';
  const code = '!' + argument0;
  return [code, order];
};


// Generator for logic_boolean.
forBlock['logic_boolean'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const code = (block.getFieldValue('BOOL') === 'TRUE') ? 'true' : 'false';
  return [code, Order.ATOMIC];
};

// Generator for logic_null.
forBlock['logic_null'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  return ['NULL', Order.ATOMIC];
};

// Generator for logic_ternary.
forBlock['logic_ternary'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const condition = generator.valueToCode(block, 'IF', Order.NONE) || 'false';
  const thenBranch = generator.valueToCode(block, 'THEN', Order.NONE) || '0';
  const elseBranch = generator.valueToCode(block, 'ELSE', Order.NONE) || '0';
  const code = '(' + condition + ') ? (' + thenBranch + ') : (' + elseBranch + ')';
  return [code, Order.ATOMIC];
};
// Generator for controls_repeat (using internal number).
// forBlock['controls_repeat'] = function (
//   block: Blockly.Block,
//   generator: Blockly.CodeGenerator,
// ) {
//   // Get the number of repeats from the field input.
//   const repeats = block.getFieldValue('TIMES') || '10';
//   const branch = generator.statementToCode(block, 'DO');
//   // For simplicity, use a fixed loop variable "i".
//   const code = 'for (int i = 0; i < ' + repeats + '; i++) {\n' +
//                branch +
//                '}\n';
//   return code;
// };

// Generator for controls_repeat_ext.
forBlock['controls_repeat_ext'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const repeats = generator.valueToCode(block, 'TIMES', Order.NONE) || '10';
  const branch = generator.statementToCode(block, 'DO');
  const code = 'for (int i = 0; i < ' + repeats + '; i++) {\n' +
               branch +
               '}\n';
  return code;
};

// Generator for controls_whileUntil.
forBlock['controls_whileUntil'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const mode = block.getFieldValue('MODE');
  let condition = generator.valueToCode(block, 'BOOL', Order.NONE) || 'false';
  // For UNTIL, invert the condition.
  if (mode === 'UNTIL') {
    condition = '!' + condition;
  }
  const branch = generator.statementToCode(block, 'DO');
  const code = 'while (' + condition + ') {\n' +
               branch +
               '}\n';
  return code;
};
forBlock['variable_declare'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator) {
    const variable = generator.nameDB_
        ? generator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME)
        : block.getFieldValue('VAR');

    // Khai báo biến int trong C
    return `int ${variable};\n`;
};
// Generator for controls_for.
forBlock['controls_for'] = function (block: any, generator: any) {
    const varName = generator.valueToCode(block, 'INT', generator.ORDER_NONE) || 'i';
    const from = generator.valueToCode(block, 'FROM', generator.ORDER_NONE) || '0';
    const to = generator.valueToCode(block, 'TO', generator.ORDER_NONE) || '0';
    const by = generator.valueToCode(block, 'BY', generator.ORDER_NONE) || '1';
    const branch = generator.statementToCode(block, 'DO');

    const loop = `for (${varName} = ${from}; ${varName} <= ${to}; ${varName} += ${by}) {\n${branch}}\n`;
    return loop;
};

forBlock['variable_declare'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const variable = generator.nameDB_
        ? generator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME)
        : block.getFieldValue('VAR');

    // Khai báo biến int trong C
    return `int ${variable};\n`;
};
forBlock['controls_for'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    // Lấy biến từ khối đầu vào
    const variableCode = generator.valueToCode(block, 'VAR', 0); // 0 tương đương với ORDER_ATOMIC

    const from = generator.valueToCode(block, 'FROM', 0); // 0 thay cho ORDER_NONE
    const to = generator.valueToCode(block, 'TO', 0);
    const by = generator.valueToCode(block, 'BY', 0);
    const branch = generator.statementToCode(block, 'DO');

    // Sử dụng biến trong vòng lặp
    return `for (${variableCode} = ${from}; ${variableCode} <= ${to}; ${variableCode} += ${by}) {\n${branch}}\n`;
};
// Generator for controls_flow_statements.
forBlock['controls_flow_statements'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const flow = block.getFieldValue('FLOW');
  let code = '';
  if (flow === 'BREAK') {
    code = 'break;\n';
  } else if (flow === 'CONTINUE') {
    code = 'continue;\n';
  }
  return code;
};
forBlock['simulate_led'] = function(
    block: Blockly.Block,
    generator: any, // Sử dụng any thay vì Blockly.CodeGenerator
) {
    const pin = generator.valueToCode(block, 'PIN', Order.ATOMIC) || '13';
    const state = block.getFieldValue('STATE');

    // Kiểm tra xem generator có thuộc tính setups_ không
    if (generator.setups_ !== undefined) {
        // Add pin mode setup to setup section
        const pinSetupCode = `pinMode(${pin}, OUTPUT);`;
        if (generator.setups_['setup_output_' + pin] === undefined) {
            generator.setups_['setup_output_' + pin] = pinSetupCode;
        }
    } else {
        // Nếu không có setups_, thêm code pinMode vào trước digitalWrite
        return `pinMode(${pin}, OUTPUT);\ndigitalWrite(${pin}, ${state});\n`;
    }

    // Generate digitalWrite code
    return `digitalWrite(${pin}, ${state});\n`;
};

// RGB LED Control Block Generator
forBlock['rgb_led_control'] = function(
    block: Blockly.Block,
    generator: any,
) {
    const redPin = block.getFieldValue('RED_PIN') || '9';
    const greenPin = block.getFieldValue('GREEN_PIN') || '10';
    const bluePin = block.getFieldValue('BLUE_PIN') || '11';
    const red = Number(block.getFieldValue('RED')) || 0;
    const green = Number(block.getFieldValue('GREEN')) || 0;
    const blue = Number(block.getFieldValue('BLUE')) || 0;

    let code = '';

    if (generator.setups_ !== undefined) {
        // Setup pin modes in setup section
        generator.setups_['setup_rgb_' + redPin] = `pinMode(${redPin}, OUTPUT);`;
        generator.setups_['setup_rgb_' + greenPin] = `pinMode(${greenPin}, OUTPUT);`;
        generator.setups_['setup_rgb_' + bluePin] = `pinMode(${bluePin}, OUTPUT);`;
    } else {
        // Nếu không có setups_, thêm code pinMode trực tiếp
        code += `pinMode(${redPin}, OUTPUT);\n`;
        code += `pinMode(${greenPin}, OUTPUT);\n`;
        code += `pinMode(${bluePin}, OUTPUT);\n`;
    }

    // Generate code that sets RGB LED values
    code += `analogWrite(${redPin}, ${red});\n`;
    code += `analogWrite(${greenPin}, ${green});\n`;
    code += `analogWrite(${bluePin}, ${blue});\n`;

    return code;
};

forBlock['rgb_led_setup'] = function(
    block: Blockly.Block,
    generator: any,
) {
    const redPin = block.getFieldValue('RED_PIN') || '9';
    const greenPin = block.getFieldValue('GREEN_PIN') || '10';
    const bluePin = block.getFieldValue('BLUE_PIN') || '11';

    let code = '';

    if (generator.setups_ !== undefined) {
        // Setup pin modes in setup section
        generator.setups_['setup_rgb_' + redPin] = `pinMode(${redPin}, OUTPUT);`;
        generator.setups_['setup_rgb_' + greenPin] = `pinMode(${greenPin}, OUTPUT);`;
        generator.setups_['setup_rgb_' + bluePin] = `pinMode(${bluePin}, OUTPUT);`;

        // Khởi tạo đèn tắt ban đầu
        generator.setups_['init_rgb_' + redPin] = `digitalWrite(${redPin}, LOW);`;
        generator.setups_['init_rgb_' + greenPin] = `digitalWrite(${greenPin}, LOW);`;
        generator.setups_['init_rgb_' + bluePin] = `digitalWrite(${bluePin}, LOW);`;
    } else {
        // Nếu không có setups_, thêm code pinMode trực tiếp
        code += `pinMode(${redPin}, OUTPUT);\n`;
        code += `pinMode(${greenPin}, OUTPUT);\n`;
        code += `pinMode(${bluePin}, OUTPUT);\n`;

        // Khởi tạo đèn tắt ban đầu
        code += `digitalWrite(${redPin}, LOW);\n`;
        code += `digitalWrite(${greenPin}, LOW);\n`;
        code += `digitalWrite(${bluePin}, LOW);\n`;
    }

    // Lưu các giá trị pin vào biến toàn cục
    if (generator.definitions_ !== undefined) {
        generator.definitions_['rgb_led_pins'] = `int rgbLedRedPin = ${redPin};\nint rgbLedGreenPin = ${greenPin};\nint rgbLedBluePin = ${bluePin};`;
    }

    return code;
};
forBlock['rgb_led_set_color'] = function(
    block: Blockly.Block,
    generator: any,
) {
    const red = Number(block.getFieldValue('RED')) || 0;
    const green = Number(block.getFieldValue('GREEN')) || 0;
    const blue = Number(block.getFieldValue('BLUE')) || 0;

    let code = '';

    // Kiểm tra nếu có khởi tạo biến toàn cục cho chân
    if (generator.definitions_ && generator.definitions_['rgb_led_pins']) {
        // Sử dụng các biến toàn cục
        code += `analogWrite(rgbLedRedPin, ${red});\n`;
        code += `analogWrite(rgbLedGreenPin, ${green});\n`;
        code += `analogWrite(rgbLedBluePin, ${blue});\n`;
    } else {
        // Nếu không có biến toàn cục, sử dụng giá trị mặc định
        code += `// Lưu ý: Bạn nên sử dụng khối "Setup RGB LED" trước\n`;
        code += `analogWrite(9, ${red});\n`;
        code += `analogWrite(10, ${green});\n`;
        code += `analogWrite(11, ${blue});\n`;
    }

    return code;
};
forBlock['rgb_led_set_color_with_pins'] = function(
    block: Blockly.Block,
    generator: any,
) {
    const redPin = block.getFieldValue('RED_PIN') || '9';
    const greenPin = block.getFieldValue('GREEN_PIN') || '10';
    const bluePin = block.getFieldValue('BLUE_PIN') || '11';
    const red = Number(block.getFieldValue('RED')) || 0;
    const green = Number(block.getFieldValue('GREEN')) || 0;
    const blue = Number(block.getFieldValue('BLUE')) || 0;

    let code = '';

    // Generate code that sets RGB LED values directly to specified pins
    code += `analogWrite(${redPin}, ${red});\n`;
    code += `analogWrite(${greenPin}, ${green});\n`;
    code += `analogWrite(${bluePin}, ${blue});\n`;

    return code;
};
forBlock['rgb_led_variable_control'] = function(
    block: Blockly.Block,
    generator: any,
) {
    // Sử dụng valueToCode để lấy giá trị từ các khối được kết nối hoặc biến được gán
    // Order.ATOMIC đảm bảo các biểu thức được đánh giá đúng thứ tự
    const redPin = generator.valueToCode(block, 'RED_PIN', generator.ORDER_ATOMIC) || '9';
    const greenPin = generator.valueToCode(block, 'GREEN_PIN', generator.ORDER_ATOMIC) || '10';
    const bluePin = generator.valueToCode(block, 'BLUE_PIN', generator.ORDER_ATOMIC) || '11';
    const redValue = generator.valueToCode(block, 'RED_VALUE', generator.ORDER_ATOMIC) || '0';
    const greenValue = generator.valueToCode(block, 'GREEN_VALUE', generator.ORDER_ATOMIC) || '0';
    const blueValue = generator.valueToCode(block, 'BLUE_VALUE', generator.ORDER_ATOMIC) || '0';

    let code = '';

    // Kiểm tra xem đây là lần đầu sử dụng các chân này hay không
    // Nếu sử dụng biến, chúng ta cần đảm bảo pinMode được thiết lập đúng
    code += `// Đảm bảo chân đèn được đặt là OUTPUT\n`;
    code += `pinMode(${redPin}, OUTPUT);\n`;
    code += `pinMode(${greenPin}, OUTPUT);\n`;
    code += `pinMode(${bluePin}, OUTPUT);\n\n`;

    // Thiết lập giá trị màu cho đèn LED
    code += `analogWrite(${redPin}, ${redValue});\n`;
    code += `analogWrite(${greenPin}, ${greenValue});\n`;
    code += `analogWrite(${bluePin}, ${blueValue});\n`;

    return code;
};
forBlock['rgb_led_variable_info'] = function(
    block: Blockly.Block,
    generator: any,
) {
    return '// Thông tin đèn RGB: Chân từ 2-13, A0-A5; Màu từ 0-255\n';
};

forBlock['rgb_led_fixed_pin_variable_color'] = function(
    block: Blockly.Block,
    generator: any,
) {
    const redPin = block.getFieldValue('RED_PIN') || '9';
    const greenPin = block.getFieldValue('GREEN_PIN') || '10';
    const bluePin = block.getFieldValue('BLUE_PIN') || '11';
    const redValue = generator.valueToCode(block, 'RED_VALUE', generator.ORDER_ATOMIC) || '0';
    const greenValue = generator.valueToCode(block, 'GREEN_VALUE', generator.ORDER_ATOMIC) || '0';
    const blueValue = generator.valueToCode(block, 'BLUE_VALUE', generator.ORDER_ATOMIC) || '0';

    let code = '';

    if (generator.setups_ !== undefined) {
        // Setup pin modes in setup section
        generator.setups_['setup_rgb_' + redPin] = `pinMode(${redPin}, OUTPUT);`;
        generator.setups_['setup_rgb_' + greenPin] = `pinMode(${greenPin}, OUTPUT);`;
        generator.setups_['setup_rgb_' + bluePin] = `pinMode(${bluePin}, OUTPUT);`;
    } else {
        // Đặt pinMode vào trong code nếu không có setups_
        code += `pinMode(${redPin}, OUTPUT);\n`;
        code += `pinMode(${greenPin}, OUTPUT);\n`;
        code += `pinMode(${bluePin}, OUTPUT);\n\n`;
    }

    // Thiết lập giá trị màu cho đèn LED
    code += `analogWrite(${redPin}, ${redValue});\n`;
    code += `analogWrite(${greenPin}, ${greenValue});\n`;
    code += `analogWrite(${bluePin}, ${blueValue});\n`;

    return code;
};

// DHT Sensor Block Generator
forBlock['dht_sensor'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const sensorType = block.getFieldValue('DHT_VALUE');
    const pin = block.getFieldValue('PIN');

    // Return appropriate code based on sensor type
    if (sensorType === 'TEMP') {
        return [`readDHTTemperature(${pin})`, Order.FUNCTION_CALL];
    } else {
        return [`readDHTHumidity(${pin})`, Order.FUNCTION_CALL];
    }
};

// Ultrasonic Sensor Block Generator
forBlock['ultrasonic_sensor'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const trigPin = block.getFieldValue('TRIG_PIN');
    const echoPin = block.getFieldValue('ECHO_PIN');

    // Generate code for reading distance from ultrasonic sensor
    return [`readUltrasonicDistance(${trigPin}, ${echoPin})`, Order.FUNCTION_CALL];
};

// DC Motor Control Block Generator
forBlock['dc_motor_control'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin1 = block.getFieldValue('PIN1');
    const pin2 = block.getFieldValue('PIN2');
    const direction = block.getFieldValue('DIRECTION');
    const speed = generator.valueToCode(block, 'SPEED', Order.NONE) || '0';

    // Generate code for controlling DC motor
    return `controlDCMotor(${pin1}, ${pin2}, ${direction}, ${speed});\n`;
};

// Light Sensor Block Generator
forBlock['light_sensor'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin = block.getFieldValue('PIN');

    // Generate code for reading light sensor value
    return [`analogRead(${pin})`, Order.FUNCTION_CALL];
};

// PIR Motion Sensor Block Generator
forBlock['pir_motion_sensor'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin = block.getFieldValue('PIN');

    // Generate code for checking if motion is detected
    return [`digitalRead(${pin}) == HIGH`, Order.EQUALITY];
};

// Debounced Button Block Generator
forBlock['debounced_button'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin = block.getFieldValue('PIN');
    const debounceTime = generator.valueToCode(block, 'DEBOUNCE_TIME', Order.NONE) || '50';

    // Generate code for reading debounced button state
    return [`readDebouncedButton(${pin}, ${debounceTime})`, Order.FUNCTION_CALL];
};

// Stepper Motor Control Block Generator
forBlock['stepper_motor_control'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const steps = generator.valueToCode(block, 'STEPS', Order.NONE) || '0';
    const speed = generator.valueToCode(block, 'SPEED', Order.NONE) || '0';

    // Generate code for controlling stepper motor
    return `moveStepperMotor(${steps}, ${speed});\n`;
};

// Serial Begin Block Generator
forBlock['serial_begin'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const baudRate = block.getFieldValue('BAUD_RATE');

    // Generate code for initializing serial communication
    return `Serial.begin(${baudRate});\n`;
};

// Map Extended Block Generator
forBlock['map_extended'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const value = generator.valueToCode(block, 'VALUE', Order.NONE) || '0';
    const fromLow = generator.valueToCode(block, 'FROM_LOW', Order.NONE) || '0';
    const fromHigh = generator.valueToCode(block, 'FROM_HIGH', Order.NONE) || '1023';
    const toLow = generator.valueToCode(block, 'TO_LOW', Order.NONE) || '0';
    const toHigh = generator.valueToCode(block, 'TO_HIGH', Order.NONE) || '255';

    // Generate code for mapping a value from one range to another
    return [`map(${value}, ${fromLow}, ${fromHigh}, ${toLow}, ${toHigh})`, Order.FUNCTION_CALL];
};

// Wait Until Block Generator
forBlock['wait_until'] = function(
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'false';

    // Generate code for waiting until a condition is met
    return `while(!(${condition})) {\n  delay(1);\n}\n`;
};

forBlock['setup'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const setupCode = generator.statementToCode(block, 'SETUP_CODE');
    return `void setup() {\n${setupCode}}\n`;
};

forBlock['loop'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const loopCode = generator.statementToCode(block, 'LOOP_CODE');
    return `void loop() {\n${loopCode}}\n`;
};

forBlock['servo_setup'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin = generator.valueToCode(block, 'SERVO_PIN', Order.ATOMIC) || '9';

    // Sử dụng addReservedWords để thêm biến servo
    generator.addReservedWords(`servo${pin}`);

    // Sử dụng provideFunction_ để thêm thư viện và định nghĩa servo
    const includeServo = generator.provideFunction_(
        'include_servo',
        `#include <Servo.h>\n`
    );

    // Định nghĩa đối tượng servo
    const defineServo = generator.provideFunction_(
        `define_servo_${pin}`,
        `Servo servo${pin};\n`
    );

    return `servo${pin}.attach(${pin});\n`;
};

forBlock['servo_rotate'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin = generator.valueToCode(block, 'SERVO_PIN', Order.ATOMIC) || '9';
    const angle = generator.valueToCode(block, 'ANGLE', Order.ATOMIC) || '90';

    return `servo${pin}.write(${angle});\n`;
};

forBlock['servo_continuous'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin = generator.valueToCode(block, 'SERVO_PIN', Order.ATOMIC) || '9';
    const speed = generator.valueToCode(block, 'SPEED', Order.ATOMIC) || '50';

    return `int mappedSpeed = map(${speed}, -100, 100, 0, 180);\nservo${pin}.write(mappedSpeed);\n`;
};

forBlock['servo_stop'] = function (
    block: Blockly.Block,
    generator: Blockly.CodeGenerator,
) {
    const pin = generator.valueToCode(block, 'SERVO_PIN', Order.ATOMIC) || '9';

    return `servo${pin}.write(90);\ndelay(15);\n`;
};

forBlock['function_wrapper'] = function(
    block: Blockly.Block,
    generator: any,
) {
    // Lấy nội dung các khối function bên trong
    const functions = generator.statementToCode(block, 'FUNCTIONS');

    // Nếu có generator.definitions_, thêm mã vào đó
    if (generator.definitions_) {
        // Thêm các hàm vào phần định nghĩa để chúng xuất hiện ở đầu chương trình
        generator.definitions_['user_functions'] = functions;
        return '';  // Không trả về mã trong vị trí hiện tại
    } else {
        // Nếu không có generator.definitions_, trả về mã trực tiếp
        return functions;
    }
};
forBlock['function_definition'] = function(
    block: Blockly.Block,
    generator: any,
) {
    // Lấy tên hàm và tham số
    let funcName = block.getFieldValue('NAME');
    const params = block.getFieldValue('PARAMS');

    // Ngăn chặn tên hàm trống
    if (funcName.length === 0) {
        funcName = 'unnamed';
    }

    // Lấy nội dung thân hàm
    let branch = generator.statementToCode(block, 'STACK');
    if (branch.length > 0) {
        branch = generator.prefixLines(generator.indent(branch), generator.INDENT);
    }

    // Tạo mã hàm
    const code = 'void ' + funcName + '(' + params + ') {\n' + branch + '}\n\n';
    return code;
};
forBlock['custom_function_block'] = function(
    block: Blockly.Block,
    generator: any,
) {
    const functionCode = block.getFieldValue('FUNCTION_CODE');
    return functionCode + '\n';
};

forBlock['code_text'] = function(
    block: Blockly.Block,
    generator: any
) {
    const code = block.getFieldValue('CODE_TEXT');
    return [code, generator.ORDER_ATOMIC];
};

// Generator functions cho custom code block
forBlock['custom_code_block'] = function(
    block: Blockly.Block,
    generator: any
) {
    const code = block.getFieldValue('CODE_TEXT') || '';
    return code + '\n';
};


// Generator functions cho custom function block
forBlock['custom_function_block'] = function(block: any, generator: any) {
    const functionBody =
        generator.valueToCode(block, 'FUNCTION_CODE', generator.ORDER_NONE) || '';

    const code =
        `void customFunction() {
${functionBody}
}\n`;

    return code;
};

//Variables
forBlock['declare_int_variable'] = function(block: Blockly.Block, generator: any) {
    const varName = block.getFieldValue('VAR_NAME');
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
    // Ensure we generate the "int" type in the declaration
    return 'int ' + varName + ' = ' + value + ';\n';
};
forBlock['declare_string_variable'] = function(block: Blockly.Block,
                                               generator: any,) {
    const varName = block.getFieldValue('VAR_NAME');
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
    // C string declaration
    return `char ${varName}[100] = ${value};\n`;
};

forBlock['declare_float_variable'] = function(block: Blockly.Block,
                                              generator: any,) {
    const varName = block.getFieldValue('VAR_NAME');
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0.0';
    // C float declaration
    return `float ${varName} = ${value};\n`;
};

forBlock['assign_variable'] = function(block: Blockly.Block,
                                       generator: any,) {
    const varName = block.getFieldValue('VAR_NAME');
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
    // C assignment
    return `${varName} = ${value};\n`;
};

forBlock['print_variable'] = function(block: Blockly.Block,
                                      generator: any,) {
    const varName = block.getFieldValue('VAR_NAME');
    // Include stdio.h if not already included
    let code = "";
    // C printf function
    return `printf("%d\\n", ${varName});\n`;
};

forBlock['variable_value'] = function(block: Blockly.Block,
                                      generator: any,) {
    const varName = block.getFieldValue('VAR_NAME');
    // Return variable name for expressions
    return [varName, generator.ORDER_ATOMIC];
};

forBlock['declare_constant'] = function(block: Blockly.Block,
                                        generator: any,) {
    const constName = block.getFieldValue('CONST_NAME');
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
    // C macro for constant
    return `#define ${constName} ${value}\n`;
};

forBlock['increment_variable'] = function(block: Blockly.Block,
                                          generator: any,) {
    const varName = block.getFieldValue('VAR_NAME');
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '1';
    // C increment syntax
    return `${varName} += ${value};\n`;
};

forBlock['declare_array'] = function(block: Blockly.Block,
                                     generator: any,) {
    const varName = block.getFieldValue('VAR_NAME');
    const size = generator.valueToCode(block, 'SIZE', generator.ORDER_ATOMIC) || '10';
    // C array declaration
    return `int ${varName}[${size}];\n`;
};

forBlock['print_format'] = function(block: Blockly.Block,
                                    generator: any,) {
    const format = block.getFieldValue('FORMAT');
    const varName = block.getFieldValue('VAR_NAME');
    // C printf with specific format
    return `printf("${format}\\n", ${varName});\n`;
};

//LCD
// Define order constants
const ORDER_NONE = 99;

// Generator for lcd_init
forBlock['lcd_init'] = function (block: any, generator: any) {
    const rs = block.getFieldValue('RS') || '12';
    const en = block.getFieldValue('E') || '11';
    const d4 = block.getFieldValue('D4') || '5';
    const d5 = block.getFieldValue('D5') || '4';
    const d6 = block.getFieldValue('D6') || '3';
    const d7 = block.getFieldValue('D7') || '2';

    // Include thư viện LiquidCrystal
    generator.provideFunction_('include_lcd_header', `
#include <LiquidCrystal.h>
`);

    // Khai báo đối tượng LCD
    generator.provideFunction_('lcd_define', `
LiquidCrystal lcd(${rs}, ${en}, ${d4}, ${d5}, ${d6}, ${d7});
`);
    return 'lcd.begin(16, 2);\n';
};


// Generator for lcd_clear
forBlock['lcd_clear'] = function(block: any, generator: any) {
    return 'lcd.clear();\n';
};

// Generator for lcd_print
forBlock['lcd_print'] = function(block: any, generator: any) {
    const text = block.getFieldValue('TEXT');
    const row = block.getFieldValue('ROW');
    const col = block.getFieldValue('COL');

    // Note: LCD's setCursor takes (col, row) not (row, col)
    return `lcd.setCursor(${col}, ${row});\nlcd.print("${text}");\n`;
};

// Generator for lcd_set_cursor
forBlock['lcd_set_cursor'] = function(block: any, generator: any) {
    const row = block.getFieldValue('ROW');
    const col = block.getFieldValue('COL');

    // Note: LCD's setCursor takes (col, row) not (row, col)
    return `lcd.setCursor(${col}, ${row});\n`;
};

// Generator for lcd_create_char
forBlock['lcd_create_char'] = function(block: any, generator: any) {
    const pos = block.getFieldValue('POS');
    const pattern = block.getFieldValue('PATTERN');

    // Generate a unique function name for this custom character
    const functionName = `create_custom_char_${pos}`;

    generator.provideFunction_(
        functionName,
        `void ${functionName}() {
  byte customChar[8] = ${pattern};
  lcd.createChar(${pos}, customChar);
}\n`
    );

    return `${functionName}();\n`;
};

// Generator for lcd_backlight
forBlock['lcd_backlight'] = function(block: any, generator: any) {
    const state = block.getFieldValue('STATE');
    return state === 'ON' ? 'lcd.backlight();\n' : 'lcd.noBacklight();\n';
};

// Generator for lcd_display
forBlock['lcd_display'] = function(block: any, generator: any) {
    const state = block.getFieldValue('STATE');
    return state === 'ON' ? 'lcd.display();\n' : 'lcd.noDisplay();\n';
};

// Generator for lcd_print_custom_char
forBlock['lcd_print_custom_char'] = function(block: any, generator: any) {
    const pos = block.getFieldValue('POS');
    return `lcd.write(byte(${pos}));\n`;
};

//button block
// Button Press and Hold Block
// Button Press and Hold Block - Improved
forBlock['button_press_hold'] = function(
    block: any,
    generator: any
) {
    const pin = generator.valueToCode(block, 'PIN', 0) || '2';
    const doCode = generator.statementToCode(block, 'DO');

    // Reserve variable names
    generator.addReservedWords(`lastDebounceTime_${pin}`);
    generator.addReservedWords(`buttonState_${pin}`);
    generator.addReservedWords(`lastButtonState_${pin}`);

    // Define variables
    generator.provideFunction_(
        `press_hold_button_${pin}_vars`,
        `// Press hold button variables for pin ${pin}
unsigned long lastDebounceTime_${pin} = 0;
bool buttonState_${pin} = HIGH;
bool lastButtonState_${pin} = HIGH;
const unsigned long debounceDelay = 50;
`
    );

    // Add setup code using provideFunction_
    generator.provideFunction_(
        `button_${pin}_setup`,
        `void button_${pin}_setup() {
  pinMode(${pin}, INPUT_PULLUP);
}
`
    );

    return `
  // Read the current button state
  bool reading_${pin} = digitalRead(${pin});
  
  // Check if the button state changed
  if (reading_${pin} != lastButtonState_${pin}) {
    // Reset the debounce timer
    lastDebounceTime_${pin} = millis();
  }
  
  // Check if debounce time has passed
  if ((millis() - lastDebounceTime_${pin}) > debounceDelay) {
    // If the button state has changed and is stable
    if (buttonState_${pin} != reading_${pin}) {
      buttonState_${pin} = reading_${pin};
      
      // If button is pressed (LOW for INPUT_PULLUP)
      if (buttonState_${pin} == LOW) {
        ${doCode}
      }
    }
  }
  
  // Save last button state
  lastButtonState_${pin} = reading_${pin};
`;
};

// Toggle Button Block - Improved
forBlock['button_toggle'] = function(
    block: any,
    generator: any
) {
    const pin = generator.valueToCode(block, 'PIN', 0) || '2';
    const onAction = generator.statementToCode(block, 'ON_ACTION');
    const offAction = generator.statementToCode(block, 'OFF_ACTION');

    // Reserve variable names
    generator.addReservedWords(`buttonState_${pin}`);
    generator.addReservedWords(`lastButtonState_${pin}`);
    generator.addReservedWords(`toggleState_${pin}`);
    generator.addReservedWords(`lastDebounceTime_${pin}`);

    // Define variables
    generator.provideFunction_(
        `toggle_button_${pin}_vars`,
        `// Toggle button variables for pin ${pin}
bool buttonState_${pin} = HIGH;
bool lastButtonState_${pin} = HIGH;
bool toggleState_${pin} = false;
unsigned long lastDebounceTime_${pin} = 0;
const unsigned long debounceDelay = 50;
`
    );

    // Add setup code
    generator.provideFunction_(
        `toggle_button_${pin}_setup`,
        `void toggle_button_${pin}_setup() {
  pinMode(${pin}, INPUT_PULLUP);
}
`
    );

    return `
  // Read the current button state
  bool reading_${pin} = digitalRead(${pin});
  
  // Check if the button state changed
  if (reading_${pin} != lastButtonState_${pin}) {
    // Reset the debounce timer
    lastDebounceTime_${pin} = millis();
  }
  
  // Check if debounce time has passed
  if ((millis() - lastDebounceTime_${pin}) > debounceDelay) {
    // If the button state has changed and is stable
    if (buttonState_${pin} != reading_${pin}) {
      buttonState_${pin} = reading_${pin};
      
      // If button is pressed (LOW for INPUT_PULLUP)
      if (buttonState_${pin} == LOW) {
        toggleState_${pin} = !toggleState_${pin};
      }
    }
  }
  
  // Save last button state
  lastButtonState_${pin} = reading_${pin};
  
  // Execute the appropriate action based on toggle state
  if (toggleState_${pin}) {
    ${onAction}
  } else {
    ${offAction}
  }
`;
};

// Long Press Button Block - Improved
forBlock['button_long_press'] = function(
    block: any,
    generator: any
) {
    const pin = generator.valueToCode(block, 'PIN', 0) || '2';
    const time = generator.valueToCode(block, 'TIME', 0) || '1000';
    const shortPressCode = generator.statementToCode(block, 'SHORT_PRESS');
    const longPressCode = generator.statementToCode(block, 'LONG_PRESS');

    // Reserve variable names
    generator.addReservedWords(`buttonPressed_${pin}`);
    generator.addReservedWords(`longPressDetected_${pin}`);
    generator.addReservedWords(`buttonPressTime_${pin}`);
    generator.addReservedWords(`lastDebounceTime_${pin}`);
    generator.addReservedWords(`buttonState_${pin}`);
    generator.addReservedWords(`lastButtonState_${pin}`);

    // Define variables
    generator.provideFunction_(
        `long_press_button_${pin}_vars`,
        `// Long press button variables for pin ${pin}
bool buttonPressed_${pin} = false;
bool longPressDetected_${pin} = false;
unsigned long buttonPressTime_${pin} = 0;
unsigned long lastDebounceTime_${pin} = 0;
bool buttonState_${pin} = HIGH;
bool lastButtonState_${pin} = HIGH;
const unsigned long debounceDelay = 50;
`
    );

    // Add setup code
    generator.provideFunction_(
        `long_press_button_${pin}_setup`,
        `void long_press_button_${pin}_setup() {
  pinMode(${pin}, INPUT_PULLUP);
}
`
    );

    return `
  // Read the current button state
  bool reading_${pin} = digitalRead(${pin});
  
  // Check if the button state changed
  if (reading_${pin} != lastButtonState_${pin}) {
    // Reset the debounce timer
    lastDebounceTime_${pin} = millis();
  }
  
  // Check if debounce time has passed
  if ((millis() - lastDebounceTime_${pin}) > debounceDelay) {
    // If the button state has changed and is stable
    if (buttonState_${pin} != reading_${pin}) {
      buttonState_${pin} = reading_${pin};
      
      // If button is pressed (LOW for INPUT_PULLUP)
      if (buttonState_${pin} == LOW) {
        if (!buttonPressed_${pin}) {
          // Button was just pressed
          buttonPressed_${pin} = true;
          buttonPressTime_${pin} = millis();
          longPressDetected_${pin} = false;
        }
      } else {
        // Button is released
        if (buttonPressed_${pin}) {
          // Button was just released
          buttonPressed_${pin} = false;
          if (!longPressDetected_${pin}) {
            // Short press detected
            ${shortPressCode}
          }
        }
      }
    }
  }
  
  // Save last button state
  lastButtonState_${pin} = reading_${pin};
  
  // Check for long press if button is currently pressed
  if (buttonPressed_${pin}) {
    if (!longPressDetected_${pin} && (millis() - buttonPressTime_${pin} > ${time})) {
      // Long press detected
      longPressDetected_${pin} = true;
      ${longPressCode}
    }
  }
`;
};

// Multi-Press Button Block - Improved
forBlock['button_multi_press'] = function(
    block: any,
    generator: any
) {
    const pin = generator.valueToCode(block, 'PIN', 0) || '2';
    const timeout = generator.valueToCode(block, 'TIMEOUT', 0) || '800';
    const press1Code = generator.statementToCode(block, 'PRESS1');
    const press2Code = generator.statementToCode(block, 'PRESS2');
    const press3Code = generator.statementToCode(block, 'PRESS3');

    // Reserve variable names
    generator.addReservedWords(`buttonState_${pin}`);
    generator.addReservedWords(`lastButtonState_${pin}`);
    generator.addReservedWords(`pressCount_${pin}`);
    generator.addReservedWords(`lastPressTime_${pin}`);
    generator.addReservedWords(`lastDebounceTime_${pin}`);
    generator.addReservedWords(`buttonReady_${pin}`);

    // Define variables
    generator.provideFunction_(
        `multi_press_button_${pin}_vars`,
        `// Multi press button variables for pin ${pin}
bool buttonState_${pin} = HIGH;
bool lastButtonState_${pin} = HIGH;
byte pressCount_${pin} = 0;
unsigned long lastPressTime_${pin} = 0;
unsigned long lastDebounceTime_${pin} = 0;
bool buttonReady_${pin} = true;
const unsigned long debounceDelay = 50;
`
    );

    // Add setup code
    generator.provideFunction_(
        `multi_press_button_${pin}_setup`,
        `void multi_press_button_${pin}_setup() {
  pinMode(${pin}, INPUT_PULLUP);
}
`
    );

    return `
  // Read button state
  bool reading_${pin} = digitalRead(${pin});
  
  // Check if the button state changed
  if (reading_${pin} != lastButtonState_${pin}) {
    // Reset the debounce timer
    lastDebounceTime_${pin} = millis();
  }
  
  // Check if debounce time has passed
  if ((millis() - lastDebounceTime_${pin}) > debounceDelay) {
    // If the button state has changed and is stable
    if (buttonState_${pin} != reading_${pin}) {
      buttonState_${pin} = reading_${pin};
      
      // If button is pressed (LOW for INPUT_PULLUP) and ready for next press
      if (buttonState_${pin} == LOW && buttonReady_${pin}) {
        buttonReady_${pin} = false;  // Prevent multiple counts on same press
        pressCount_${pin}++;
        lastPressTime_${pin} = millis();
      }
      
      // If button is released
      if (buttonState_${pin} == HIGH) {
        buttonReady_${pin} = true;  // Ready for next press
      }
    }
  }
  
  // Check if it's time to process multiple presses
  if (pressCount_${pin} > 0 && (millis() - lastPressTime_${pin} > ${timeout})) {
    // Execute action based on press count
    if (pressCount_${pin} == 1) {
      ${press1Code}
    } else if (pressCount_${pin} == 2) {
      ${press2Code}
    } else if (pressCount_${pin} >= 3) {
      ${press3Code}
    }
    // Reset press counter
    pressCount_${pin} = 0;
  }
  
  // Save current button state
  lastButtonState_${pin} = reading_${pin};
`;
};

// Directional Control Buttons Block - Improved
forBlock['button_directional'] = function(
    block: any,
    generator: any
) {
    const upPin = generator.valueToCode(block, 'UP_PIN', 0) || '2';
    const downPin = generator.valueToCode(block, 'DOWN_PIN', 0) || '3';
    const leftPin = generator.valueToCode(block, 'LEFT_PIN', 0) || '4';
    const rightPin = generator.valueToCode(block, 'RIGHT_PIN', 0) || '5';
    const actionsCode = generator.statementToCode(block, 'ACTIONS');

    // Reserve variable names
    generator.addReservedWords('direction');
    generator.addReservedWords('lastDirection');
    generator.addReservedWords('dirLastDebounceTime');

    // Define variables
    generator.provideFunction_(
        'direction_variables',
        `// Direction variables for directional control
char direction = 0; // 0=none, U=up, D=down, L=left, R=right
char lastDirection = 0;
unsigned long dirLastDebounceTime = 0;
const unsigned long dirDebounceDelay = 50;
`
    );

    // Add setup code
    generator.provideFunction_(
        'directional_buttons_setup',
        `void directional_buttons_setup() {
  pinMode(${upPin}, INPUT_PULLUP);
  pinMode(${downPin}, INPUT_PULLUP);
  pinMode(${leftPin}, INPUT_PULLUP);
  pinMode(${rightPin}, INPUT_PULLUP);
}
`
    );

    return `
  // Previous direction
  char prevDirection = direction;
  
  // Check each button
  if (digitalRead(${upPin}) == LOW) {
    direction = 'U';
  } else if (digitalRead(${downPin}) == LOW) {
    direction = 'D';
  } else if (digitalRead(${leftPin}) == LOW) {
    direction = 'L';
  } else if (digitalRead(${rightPin}) == LOW) {
    direction = 'R';
  } else {
    direction = 0;
  }
  
  // If direction changed, reset debounce timer
  if (direction != lastDirection) {
    dirLastDebounceTime = millis();
  }
  
  // If debounce time passed and direction is stable
  if ((millis() - dirLastDebounceTime > dirDebounceDelay) && (direction != 0) && (direction == lastDirection)) {
    ${actionsCode}
  }
  
  // Save last direction
  lastDirection = direction;
`;
};

// LCD/OLED Menu Navigation Block - Improved
forBlock['button_lcd_menu'] = function(
    block: any,
    generator: any
) {
    const pages = generator.valueToCode(block, 'PAGES', 0) || '3';
    const nextPin = generator.valueToCode(block, 'NEXT_PIN', 0) || '2';
    const selectPin = generator.valueToCode(block, 'SELECT_PIN', 0) || '3';
    const pageChangeCode = generator.statementToCode(block, 'PAGE_CHANGE');
    const selectionCode = generator.statementToCode(block, 'SELECTION');

    // Reserve variable names
    generator.addReservedWords('currentPage');
    generator.addReservedWords('totalPages');
    generator.addReservedWords('nextLastState');
    generator.addReservedWords('selectLastState');
    generator.addReservedWords('nextDebounceTime');
    generator.addReservedWords('selectDebounceTime');
    generator.addReservedWords('nextButtonState');
    generator.addReservedWords('selectButtonState');

    // Define variables
    generator.provideFunction_(
        'lcd_menu_variables',
        `// LCD menu variables
int currentPage = 0;
int totalPages = ${pages};
bool nextLastState = HIGH;
bool selectLastState = HIGH;
unsigned long nextDebounceTime = 0;
unsigned long selectDebounceTime = 0;
bool nextButtonState = HIGH;
bool selectButtonState = HIGH;
const unsigned long menuDebounceDelay = 50;
`
    );

    // Add setup code
    generator.provideFunction_(
        'lcd_menu_setup',
        `void lcd_menu_setup() {
  pinMode(${nextPin}, INPUT_PULLUP);
  pinMode(${selectPin}, INPUT_PULLUP);
}
`
    );

    return `
  // Handle Next button
  bool nextReading = digitalRead(${nextPin});
  
  // Check if the next button state changed
  if (nextReading != nextLastState) {
    nextDebounceTime = millis();
  }
  
  // If debounce delay passed for next button
  if ((millis() - nextDebounceTime) > menuDebounceDelay) {
    // If the state has changed and is stable
    if (nextButtonState != nextReading) {
      nextButtonState = nextReading;
      
      // If button is pressed (LOW for INPUT_PULLUP)
      if (nextButtonState == LOW) {
        currentPage = (currentPage + 1) % totalPages;
        ${pageChangeCode}
      }
    }
  }
  nextLastState = nextReading;
  
  // Handle Select button
  bool selectReading = digitalRead(${selectPin});
  
  // Check if the select button state changed
  if (selectReading != selectLastState) {
    selectDebounceTime = millis();
  }
  
  // If debounce delay passed for select button
  if ((millis() - selectDebounceTime) > menuDebounceDelay) {
    // If the state has changed and is stable
    if (selectButtonState != selectReading) {
      selectButtonState = selectReading;
      
      // If button is pressed (LOW for INPUT_PULLUP)
      if (selectButtonState == LOW) {
        ${selectionCode}
      }
    }
  }
  selectLastState = selectReading;
`;
};
