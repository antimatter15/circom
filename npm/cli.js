#!/usr/bin/env node

const { CircomRunner } = require('./index')
const fs = require('fs')
const path = require('path')

async function main() {
    const args = process.argv
        .slice(2)
        .map((k) => (k.startsWith('-') ? k : path.relative(process.cwd(), k)))
    if (args.length === 0) args.push('--help')
    
    // There is a slight delay between this logging and the circom compiler version logging
    if (args.includes('--version')) {
        console.log('circom2 npm package', require('./package.json').version)
    }
    
    const circom = new CircomRunner({
        args,
        env: process.env,
        bindings: { fs }
    })
    
    try {
        await circom.execute()
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
