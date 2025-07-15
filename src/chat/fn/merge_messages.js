export function merge_messages(message1, message2) {
    if (Array.isArray(message2) || !message1) {
        return message2;
    }
    let newContent = message2;
    // Remove start tokens
    if (newContent.startsWith("```")) {
        const index = newContent.indexOf("\n");
        if (index != -1) {
            newContent = newContent.substring(index);
        }
    } else if (newContent.startsWith("...")) {
        newContent = " " + newContent.substring(3);
    } else if (newContent.startsWith(message1)) {
        newContent = newContent.substring(message1.length);
    } else {
        // Remove duplicate lines
        let lines = message1.trim().split("\n");
        let lastLine = lines[lines.length - 1];
        let foundLastLine = newContent.indexOf(lastLine + "\n");
        if (foundLastLine != -1) {
            foundLastLine += 1;
        } else {
            foundLastLine = newContent.indexOf(lastLine);
        }
        if (foundLastLine != -1) {
            newContent = newContent.substring(foundLastLine + lastLine.length);
        } // Remove duplicate words
        else if (newContent.indexOf(" ") > 0) {
            let words = message1.trim().split(" ");
            let lastWord = words[words.length - 1];
            if (newContent.startsWith(lastWord)) {
                newContent = newContent.substring(lastWord.length);
            }
        }
    }
    return message1 + newContent;
}
