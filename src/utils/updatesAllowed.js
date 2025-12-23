const updatesAllowed = (data) => {
    const allowed = ["age", "about", "photoURL", "skills", "gender", "firstName", "lastName"];
    return Object.keys(data).every((k) => allowed.includes(k));
}

module.exports = updatesAllowed;