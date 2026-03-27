const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, './index.html');
const htmlContent = fs.readFileSync(filePath, 'utf8');

test('HTML Format: Should have a valid DOCTYPE and Lang attribute', () => {
    expect(htmlContent).toMatch(/<!DOCTYPE html>/i);
    expect(htmlContent).toMatch(/<html lang="en">/i);
});

test('HTML Syntax: Brackets < > must be balanced', () => {
    const pureHTML = htmlContent
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '');
    const opening = (pureHTML.match(/</g) || []).length;
    const closing = (pureHTML.match(/>/g) || []).length;
    expect(opening).toBe(closing);
});

test('JS Syntax: Braces { } and Parens ( ) must be balanced', () => {
    const openBraces = (htmlContent.match(/{/g) || []).length;
    const closeBraces = (htmlContent.match(/}/g) || []).length;
    const openParens = (htmlContent.match(/\(/g) || []).length;
    const closeParens = (htmlContent.match(/\)/g) || []).length;

    expect(openBraces).toBe(closeBraces);
    expect(openParens).toBe(closeParens);
});

test('Standard: Logic must be inside <script> tags', () => {
    const bodyOnly = htmlContent.replace(/<script[\s\S]*?<\/script>/gi, '');
    const hasIllegalJS = /const\s|let\s|var\s|function\s|=>/.test(bodyOnly);
    expect(hasIllegalJS).toBe(false);
});
