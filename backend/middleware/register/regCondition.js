import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

// Create DOMPurify instance with jsdom window
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);


export const regCondition = (req, res, next) => {
    const { username, email, password } = req.body;
    const namePattern = /^[a-zA-Z0-9_@]+$/

    if (!username || username.trim() === "") {
        return res.status(400).json({ message: "Username is required" });
    }
    if (!namePattern.test(username)) {
        return res.status(400).json({ message: "Invalid username only allow for Letter and Number" });
    }
    if (!email || email.trim() === "") {
        return res.status(400).json({ message: "Email is required" });
    }
    if (!password || password.trim() === "") {
        return res.status(400).json({ message: "Password is required" });
    }

    const userName = DOMPurify.sanitize(username)
    const userEmail = DOMPurify.sanitize(email)
    const userPassword = DOMPurify.sanitize(password)

    req.body.username = userName;
    req.body.email = userEmail;
    req.body.password = userPassword;

    next();
}