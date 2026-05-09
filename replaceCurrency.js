const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'screens', 'LessonDetailScreen.js');
let content = fs.readFileSync(filePath, 'utf-8');

// Ensure currencySymbol is imported
if (content.includes('const { userImage, formatCurrency } = useContext(UserContext);')) {
  content = content.replace('const { userImage, formatCurrency } = useContext(UserContext);', 'const { userImage, formatCurrency, currencySymbol } = useContext(UserContext);');
} else if (content.includes('const { userImage } = useContext(UserContext);')) {
  content = content.replace('const { userImage } = useContext(UserContext);', 'const { userImage, formatCurrency, currencySymbol } = useContext(UserContext);');
}

// Replace "Rp _______"
content = content.replace(/Rp\s+_______/g, '{currencySymbol} _______');

// Ensure the JSX parser parses this correctly if it's inside <Text>
// e.g. <Text>Housing: {currencySymbol} _______</Text>
// Wait, if it's `{currencySymbol} _______` inside a <Text> block, React native JSX will parse it correctly as a text node combination!
// No, React JSX will see `{currencySymbol}` as an expression and ` _______` as text.

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Second pass complete.');
