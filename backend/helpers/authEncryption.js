import bcrypt from 'bcryptjs';

//  * this methods are created for the encryption of the passwords

export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
     console.log(error);   
    }
}

export const comparePassword = async (password,hashedPass)=>{
    return await bcrypt.compare(password,hashedPass);
}