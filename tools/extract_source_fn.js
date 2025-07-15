import fs from 'fs/promises';

const sourceFilePath = 'public/js/chat.v1.js'; // Path to your source file
const outputFilePath = 'output.js'; // Path to your output file

const extractAndReplaceFunctions = async () => {
    try {
        // Read the source file
        const data = await fs.readFile(sourceFilePath, 'utf8');

        // Regular expression to match top-level function declarations (including async functions)
        const functionRegex = /^(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)\s*{([^]*?)}\s*$/gm;
        let match;
        let output = data; // Start with the original data

        // Array to hold export statements
        const exportStatements = [];

        // Extract functions and prepare export statements
        while ((match = functionRegex.exec(data)) !== null) {
            const functionName = match[1];
            const functionBody = match[0]; // Full function declaration

            // Create export statement
            exportStatements.push(`export const ${functionName} = ${functionBody};`);

            // Replace the function declaration with an import statement
            output = output.replace(functionBody, `import { ${functionName} } from './${functionName}';\n`);
        }

        // Append export statements to the output
        output += '\n\n' + exportStatements.join('\n');

        // Write to the new file
        await fs.writeFile(outputFilePath, output);
        console.log(`Functions exported and original functions replaced in ${outputFilePath}`);

    } catch (err) {
        console.error(err);
    }
};

// Execute the function
extractAndReplaceFunctions();