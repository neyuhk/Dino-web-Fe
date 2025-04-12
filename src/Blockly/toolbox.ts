export const toolbox = {
    kind: 'categoryToolbox',
    contents: [
        // Arduino Core - Primary category for Arduino users
        {
            kind: 'category',
            name: 'Arduino',
            colour: '#00979C', // Standard Arduino blue-green
            contents: [
                {
                    kind: 'block',
                    type: 'setup',
                },
                {
                    kind: 'block',
                    type: 'loop',
                },
                {
                    kind: 'block',
                    type: 'base_delay',
                    inputs: {
                        DELAY_TIME: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 1000 }
                            }
                        }
                    }
                },
                { kind: 'block', type: 'millis' },
                {
                    kind: 'block',
                    type: 'delay_microseconds',
                    inputs: {
                        DELAY_US: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 100 }
                            }
                        }
                    }
                }
                ,
                { kind: 'block', type: 'inout_highlow' },
                { kind: 'block', type: 'base_map' },
                { kind: 'block', type: 'map_extended' },
                { kind: 'block', type: 'wait_until' },
            ],
        },

        // I/O Operations
        {
            kind: 'category',
            name: 'Input/Output',
            colour: '#00979C', // Same Arduino color family
            contents: [
                { kind: 'block', type: 'inout_pin_mode' },
                { kind: 'block', type: 'inout_digital_write' },
                { kind: 'block', type: 'inout_digital_read' },
                { kind: 'block', type: 'inout_analog_write' },
                { kind: 'block', type: 'inout_analog_read' },
                { kind: 'block', type: 'inout_buildin_led' },
                // { kind: 'block', type: 'simulate_led' },
                { kind: 'block', type: 'inout_tone' },
                { kind: 'block', type: 'inout_notone' },
            ],
        },

        // Serial Communication
        {
            kind: 'category',
            name: 'Serial',
            colour: '#00979C', // Same Arduino color family
            contents: [
                { kind: 'block', type: 'serial_begin' },
                { kind: 'block', type: 'serial_print' },
                { kind: 'block', type: 'serial_println' },
            ],
        },

        // Sensors and Components - All hardware components
        {
            kind: 'category',
            name: 'Sensors & Components',
            colour: '#FF6F00', // Orange for hardware components
            contents: [
                // LED controls
                { kind: 'block', type: 'rgb_led_variable_info' },
                { kind: 'block', type: 'simulate_led' },
                { kind: 'block', type: 'rgb_led_control' },
                { kind: 'block', type: 'rgb_led_setup' },
                { kind: 'block', type: 'rgb_led_variable_control' },
                { kind: 'block', type: 'rgb_led_set_color' },
                { kind: 'block', type: 'rgb_led_set_color_with_pins' },
                { kind: 'block', type: 'rgb_led_fixed_pin_variable_color' },

                // Sensors
                { kind: 'block', type: 'dht_sensor' },
                { kind: 'block', type: 'ultrasonic_sensor' },
                { kind: 'block', type: 'light_sensor' },
                { kind: 'block', type: 'pir_motion_sensor' },
                { kind: 'block', type: 'debounced_button' },

                // Motors
                { kind: 'block', type: 'dc_motor_control' },
                { kind: 'block', type: 'stepper_motor_control' },
            ],
        },

        // Servo subcategory - Special section for servo motors
        {
            kind: 'category',
            name: 'Servo Motors',
            colour: '#ff65f3', // Same as components for consistency
            contents: [
                {
                    kind: 'block',
                    type: 'servo_setup',
                    inputs: {
                        SERVO_PIN: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 9 }
                            }
                        }
                    }
                },
                {
                    kind: 'block',
                    type: 'servo_move',
                },
                {
                    kind: 'block',
                    type: 'servo_read_degrees',
                },
                {
                    kind: 'block',
                    type: 'servo_rotate',
                    inputs: {
                        SERVO_PIN: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 9 }
                            }
                        },
                        ANGLE: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 90 }
                            }
                        }
                    }
                },
            ]
        },
        {
            kind: 'category',
            name: 'LCD',
            colour: '#00BFFF',
            contents: [

                { kind: 'block', type: 'lcd_instruction_block' },
                {
                    kind: 'block',
                    type: 'lcd_init',
                    fields: {
                        RS: '12',
                        E: '11',
                        D4: '5',
                        D5: '4',
                        D6: '3',
                        D7: '2'
                    }
                },
                { kind: 'block', type: 'lcd_clear' },
                { kind: 'block', type: 'lcd_print' },
                { kind: 'block', type: 'lcd_set_cursor' },
                { kind: 'block', type: 'lcd_create_char' },
                { kind: 'block', type: 'lcd_backlight' },
                { kind: 'block', type: 'lcd_display' },
                { kind: 'block', type: 'lcd_print_custom_char' }
            ]
        },
        {
            kind: 'category',
            name: 'Button',
            colour: 300,
            contents: [
                { kind: 'block', type: 'button_press_hold' },
                { kind: 'block', type: 'button_toggle' },
                { kind: 'block', type: 'button_long_press' },
                { kind: 'block', type: 'button_multi_press' },
                { kind: 'block', type: 'button_directional' },
            ]
        },
        // Output & Feedback
        {
            kind: 'category',
            name: 'Output & Feedback',
            colour: '#FFAB19', // Yellow-orange
            contents: [
                { kind: 'block', type: 'print_result' },
                { kind: 'block', type: 'add_text' },
                { kind: 'block', type: 'log_text' },
                // { kind: 'block', type: 'text_print' },
            ]
        },

        // Programming Logic - Grouped together for programming flow
        {
            kind: 'category',
            name: 'Logic',
            categorystyle: 'logic_category',
            contents: [
                { kind: 'block', type: 'controls_if' },
                { kind: 'block', type: 'logic_compare' },
                { kind: 'block', type: 'logic_operation' },
                { kind: 'block', type: 'logic_negate' },
                { kind: 'block', type: 'logic_boolean' },
                { kind: 'block', type: 'logic_null' },
                { kind: 'block', type: 'logic_ternary' },
            ],
        },

        {
            kind: 'category',
            name: 'Loops',
            categorystyle: 'loop_category',
            contents: [
                {
                    kind: 'block',
                    type: 'controls_repeat_ext',
                    inputs: {
                        TIMES: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 10 },
                            },
                        },
                    },
                },
                { kind: 'block', type: 'controls_whileUntil' },
                {
                    kind: 'block',
                    type: 'controls_for'
                },
                { kind: 'block', type: 'variable_declare' },
                { kind: 'block', type: 'controls_forEach' },
                { kind: 'block', type: 'controls_flow_statements' },
            ],
        },

        // Data Types - Grouped together
        {
            kind: 'category',
            name: 'Math',
            categorystyle: 'math_category',
            contents: [
                {
                    kind: 'block',
                    type: 'math_number',
                    fields: { NUM: 123 },
                },
                {
                    kind: 'block',
                    type: 'math_arithmetic',
                    inputs: {
                        A: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 1 },
                            },
                        },
                        B: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 1 },
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'math_single',
                    inputs: {
                        NUM: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 9 },
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'math_trig',
                    inputs: {
                        NUM: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 45 },
                            },
                        },
                    },
                },
                { kind: 'block', type: 'math_constant' },
                {
                    kind: 'block',
                    type: 'math_number_property',
                    inputs: {
                        NUMBER_TO_CHECK: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 0 },
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'math_round',
                    fields: { OP: 'ROUND' },
                    inputs: {
                        NUM: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 3.1 },
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'math_on_list',
                    fields: { OP: 'SUM' },
                },
                {
                    kind: 'block',
                    type: 'math_modulo',
                    inputs: {
                        DIVIDEND: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 64 },
                            },
                        },
                        DIVISOR: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 10 },
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'math_constrain',
                    inputs: {
                        VALUE: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 50 },
                            },
                        },
                        LOW: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 1 },
                            },
                        },
                        HIGH: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 100 },
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'math_random_int',
                    inputs: {
                        FROM: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 1 },
                            },
                        },
                        TO: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 100 },
                            },
                        },
                    },
                },
                { kind: 'block', type: 'math_random_float' },
                {
                    kind: 'block',
                    type: 'math_atan2',
                    inputs: {
                        X: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 1 },
                            },
                        },
                        Y: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 1 },
                            },
                        },
                    },
                },
            ],
        },

        {
            kind: 'category',
            name: 'Text',
            categorystyle: 'text_category',
            contents: [
                { kind: 'block', type: 'text' },
                { kind: 'block', type: 'text_join' },
                {
                    kind: 'block',
                    type: 'text_append',
                    inputs: {
                        TEXT: {
                            shadow: {
                                type: 'text',
                                fields: { TEXT: '' },
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'text_length',
                    inputs: {
                        VALUE: {
                            shadow: {
                                type: 'text',
                                fields: { TEXT: 'abc' },
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'text_isEmpty',
                    inputs: {
                        VALUE: {
                            shadow: {
                                type: 'text',
                                fields: { TEXT: '' },
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'text_indexOf',
                    inputs: {
                        VALUE: {
                            block: { type: 'variables_get' },
                        },
                        FIND: {
                            shadow: {
                                type: 'text',
                                fields: { TEXT: 'abc' },
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'text_charAt',
                    inputs: {
                        VALUE: {
                            block: { type: 'variables_get' },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'text_getSubstring',
                    inputs: {
                        STRING: {
                            block: { type: 'variables_get' },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'text_changeCase',
                    inputs: {
                        TEXT: {
                            shadow: {
                                type: 'text',
                                fields: { TEXT: 'abc' },
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'text_trim',
                    inputs: {
                        TEXT: {
                            shadow: {
                                type: 'text',
                                fields: { TEXT: 'abc' },
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'text_count',
                    inputs: {
                        SUB: { shadow: { type: 'text' } },
                        TEXT: { shadow: { type: 'text' } },
                    },
                },
                {
                    kind: 'block',
                    type: 'text_replace',
                    inputs: {
                        FROM: { shadow: { type: 'text' } },
                        TO: { shadow: { type: 'text' } },
                        TEXT: { shadow: { type: 'text' } },
                    },
                },
                {
                    kind: 'block',
                    type: 'text_reverse',
                    inputs: {
                        TEXT: { shadow: { type: 'text' } },
                    },
                },
            ],
        },

        {
            kind: 'category',
            name: 'Lists',
            categorystyle: 'list_category',
            contents: [
                { kind: 'block', type: 'lists_create_with' },
                {
                    kind: 'block',
                    type: 'lists_repeat',
                    inputs: {
                        NUM: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 5 },
                            },
                        },
                    },
                },
                { kind: 'block', type: 'lists_length' },
                { kind: 'block', type: 'lists_isEmpty' },
                {
                    kind: 'block',
                    type: 'lists_indexOf',
                    inputs: {
                        VALUE: {
                            block: { type: 'variables_get' },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'lists_getIndex',
                    inputs: {
                        VALUE: {
                            block: { type: 'variables_get' },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'lists_setIndex',
                    inputs: {
                        LIST: {
                            block: { type: 'variables_get' },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'lists_getSublist',
                    inputs: {
                        LIST: {
                            block: { type: 'variables_get' },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'lists_split',
                    inputs: {
                        DELIM: {
                            shadow: {
                                type: 'text',
                                fields: { TEXT: ',' },
                            },
                        },
                    },
                },
                { kind: 'block', type: 'lists_sort' },
                { kind: 'block', type: 'lists_reverse' },
            ],
        },

        {
            kind: 'category',
            name: 'Color',
            colour: '#5BA58C', // Consistent color for visual elements
            contents: [
                { kind: 'block', type: 'colour_picker' },
                { kind: 'block', type: 'colour_random' },
                { kind: 'block', type: 'colour_rgb' },
                { kind: 'block', type: 'colour_blend' },
            ],
        },

        // Variables & Functions - Core programming elements
        {
            kind: 'category',
            name: 'Variables',
            categorystyle: 'variable_category',
            contents: [
                { kind: 'block', type: 'declare_int_variable' },
                { kind: 'block', type: 'declare_string_variable' },
                { kind: 'block', type: 'declare_float_variable' },
                { kind: 'block', type: 'assign_variable' },
                { kind: 'block', type: 'print_variable' },
                { kind: 'block', type: 'variable_value' },
                { kind: 'block', type: 'declare_constant' },
                { kind: 'block', type: 'increment_variable' },
            ]
        },

        {
            kind: 'category',
            name: 'Functions',
            categorystyle: 'procedure_category',
            // custom: 'PROCEDURE',
            contents: [
                { kind: 'block', type: 'procedures_defnoreturn' },
                { kind: 'block', type: 'procedures_defreturn' },
                { kind: 'block', type: 'procedures_ifreturn' },

                // { kind: 'block', type: 'function_wrapper' },
                { kind: 'block', type: 'function_definition' },
                { kind: 'block', type: 'code_text' },
                { kind: 'block', type: 'custom_code_block' },
                { kind: 'block', type: 'custom_function_block' },
                { kind: 'block', type: 'function_call' },
            ],
        },
    ],
}