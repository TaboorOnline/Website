// // src/modules/landing/services/contactService.ts
// import { supabase } from '../../../app/supabaseClient';

// interface ContactFormData {
//   name: string;
//   email: string;
//   phone: string;
//   message: string;
// }

// // Send contact message
// export const sendContactMessage = async (data: ContactFormData) => {
//   const { error } = await supabase
//     .from('contact_messages')
//     .insert([
//       {
//         name: data.name,
//         email: data.email,
//         phone: data.phone,
//         message: data.message,
//         read: false,
//         archived: false,
//       },
//     ]);
  
//   if (error) throw new Error(error.message);
//   return { success: true };
// };