use ansi_term::Colour;
use compiler::compiler_interface;
use compiler::compiler_interface::{Config, VCP};

pub struct CompilerConfig {
    pub js_folder: String,
    pub wasm_name: String,
    pub wat_file: String,
    pub wasm_file: String,
    pub c_folder: String,
    pub c_run_name: String,
    pub c_file: String,
    pub dat_file: String,
    pub wat_flag: bool,
    pub wasm_flag: bool,
    pub c_flag: bool,
    pub debug_output: bool,
    pub produce_input_log: bool,
    pub vcp: VCP,
}

pub fn compile(config: CompilerConfig) -> Result<(), ()> {
    let circuit = compiler_interface::run_compiler(
        config.vcp,
        Config { debug_output: config.debug_output, produce_input_log: config.produce_input_log, wat_flag: config.wat_flag },
    )?;

    if config.c_flag {
        compiler_interface::write_c(&circuit, &config.c_folder, &config.c_run_name, &config.c_file, &config.dat_file)?;
        println!(
            "{} {} and {}",
            Colour::Green.paint("Written successfully:"),
            config.c_file,
            config.dat_file
        );
        println!(
            "{} {}/{}, {}, {}, {}, {}, {}, {} and {}",
            Colour::Green.paint("Written successfully:"),
	    &config.c_folder,
            "main.cpp".to_string(),
            "circom.hpp".to_string(),
            "calcwit.hpp".to_string(),
            "calcwit.cpp".to_string(),
            "fr.hpp".to_string(),
            "fr.cpp".to_string(),
            "fr.asm".to_string(),
            "Makefile".to_string()
        );
    }

    if config.wat_flag {
        compiler_interface::write_wasm(&circuit,  &config.js_folder, &config.wasm_name, &config.wat_file)?;
        println!("{} {}", Colour::Green.paint("Written successfully:"), config.wat_file);
    }

    if config.wasm_flag {
        println!("{}", Colour::Red.paint("wasm is not directly supported in this build, instead use --wat and subsequently run wat2wasm from wabt"));
        return Result::Err(())
    }

    Ok(())
}

