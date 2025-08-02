@@ .. @@
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     
     if (!isAuthorized) {
       setShowPasswordModal(true);
       return;
     }
     
     if (!photo) {
       setMessage({ type: 'error', text: 'Please upload a photo' });
       return;
     }
 
+    // Validate all required fields
+    const requiredFields = [
+      { key: 'sign_details', label: 'Sign Details' },
+      { key: 'sign_type', label: 'Sign Type' },
+      { key: 'mutcd_name', label: 'MUTCD Name' },
+      { key: 'mutcd_code', label: 'MUTCD Code' },
+      { key: 'legend_color', label: 'Legend Color' },
+      { key: 'background_color', label: 'Background Color' },
+      { key: 'sign_shape', label: 'Sign Shape' }
+    ];
+
+    for (const field of requiredFields) {
+      if (!formData[field.key as keyof typeof formData]) {
+        setMessage({ type: 'error', text: `${field.label} is required` });
+        return;
+      }
+    }
+
     setIsSubmitting(true);
+    setMessage(null);
+    
     try {
       const signData = {
         photo,
         ...formData,
         upload_date: new Date().toISOString()
       };
       
+      console.log('Submitting sign data:', { ...signData, photo: 'base64_data_truncated' });
       const result = await onUpload(signData);
       
       if (result.success) {
         // Reset form
         setFormData({
           sign_details: '',
           sign_type: '',
           mutcd_name: '',
           mutcd_code: '',
           legend_color: '',
           background_color: '',
           sign_shape: ''
         });
         setPhoto('');
         setMessage({ type: 'success', text: 'Sign uploaded successfully!' });
+        
+        // Scroll to top to show success message
+        window.scrollTo({ top: 0, behavior: 'smooth' });
       } else {
         setMessage({ type: 'error', text: result.error || 'Error uploading sign' });
       }
     } catch (error) {
+      console.error('Upload error:', error);
       setMessage({ type: 'error', text: 'Error uploading sign' });
     } finally {
       setIsSubmitting(false);
     }
   };

export default handleSubmit