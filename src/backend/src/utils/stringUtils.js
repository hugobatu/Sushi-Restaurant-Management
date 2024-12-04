const generateUsername = (staff_name) => {
    const nameParts = staff_name.toLowerCase().split(' ');
    const initials = nameParts.slice(0, -1).map((n) => n[0]).join('');
    const lastName = nameParts[nameParts.length - 1];
    return initials + lastName; // Example: "Nguyễn Văn A" -> "nva"
};

const formatBirthDate = (birth_date) => {
    const date = new Date(birth_date);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}${month}${year}`; // Example: "1995-04-15" -> "15041995"
};

module.exports = { generateUsername, formatBirthDate };