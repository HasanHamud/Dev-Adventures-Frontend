// src/Validators/PasswordValidator/PasswordValidator.js

export class PasswordValidator {
    static RULES = {
        MINIMUM_LENGTH: 8,
        HAS_UPPERCASE: /[A-Z]/,
        HAS_LOWERCASE: /[a-z]/,
        HAS_NUMBER: /[0-9]/,
        HAS_SPECIAL_CHAR: /[!@#$%^&*(),.?":{}|<>]/
    };

    static validate(password) {
        const validationResults = {
            isValid: true,
            errors: [],
            checks: {
                length: false,
                uppercase: false,
                lowercase: false,
                number: false,
                specialChar: false
            }
        };

        // Check minimum length
        validationResults.checks.length = password.length >= this.RULES.MINIMUM_LENGTH;
        if (!validationResults.checks.length) {
            validationResults.errors.push(`Password must be at least ${this.RULES.MINIMUM_LENGTH} characters long`);
        }

        // Check for uppercase letter
        validationResults.checks.uppercase = this.RULES.HAS_UPPERCASE.test(password);
        if (!validationResults.checks.uppercase) {
            validationResults.errors.push('Password must contain at least one uppercase letter');
        }

        // Check for lowercase letter
        validationResults.checks.lowercase = this.RULES.HAS_LOWERCASE.test(password);
        if (!validationResults.checks.lowercase) {
            validationResults.errors.push('Password must contain at least one lowercase letter');
        }

        // Check for number
        validationResults.checks.number = this.RULES.HAS_NUMBER.test(password);
        if (!validationResults.checks.number) {
            validationResults.errors.push('Password must contain at least one number');
        }

        // Check for special character
        validationResults.checks.specialChar = this.RULES.HAS_SPECIAL_CHAR.test(password);
        if (!validationResults.checks.specialChar) {
            validationResults.errors.push('Password must contain at least one special character');
        }

        // Update overall validity
        validationResults.isValid = validationResults.errors.length === 0;

        // Calculate password strength
        validationResults.strength = this.calculatePasswordStrength(password, validationResults.checks);

        return validationResults;
    }

    static calculatePasswordStrength(password, checks) {
        let strength = 0;

        // Base points for length
        if (password.length >= this.RULES.MINIMUM_LENGTH) {
            strength += 25;
            // Bonus points for extra length
            strength += Math.min(25, (password.length - this.RULES.MINIMUM_LENGTH) * 2);
        }

        // Points for character variety
        if (checks.uppercase) strength += 10;
        if (checks.lowercase) strength += 10;
        if (checks.number) strength += 10;
        if (checks.specialChar) strength += 20;

        return Math.min(100, strength);
    }

    static getStrengthLevel(strength) {
        if (strength >= 80) return 'Strong';
        if (strength >= 60) return 'Moderate';
        if (strength >= 30) return 'Weak';
        return 'Very Weak';
    }

    static getStrengthColor(strength) {
        if (strength >= 80) return 'green-500';
        if (strength >= 60) return 'yellow-500';
        if (strength >= 30) return 'orange-500';
        return 'red-500';
    }
}