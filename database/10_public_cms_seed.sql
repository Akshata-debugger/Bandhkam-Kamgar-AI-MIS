USE bandhkam_kamgar_db;
INSERT INTO site_content(content_key,language_code,title,body) VALUES
('organization','mr','रत्नागिरी जिल्हा जनरल कामगार युनियन','रत्नागिरी जिल्हा जनरल कामगार युनियन\n(सेंटर ऑफ इंडियन ट्रेड युनियन्स – CITU संलग्न)'),
('organization','en','Ratnagiri District General Workers Union','Ratnagiri District General Workers Union\n(CITU Affiliated)'),
('mission','mr','आमचे उद्दिष्ट','कामगारांना संघटित करून त्यांच्या हक्कांसाठी, न्याय्य वेतनासाठी आणि सामाजिक सुरक्षेसाठी प्रभावीपणे लढा देणे.\n\nप्रत्येक पात्र कामगाराला शासनाच्या कायदेशीर व कल्याणकारी योजनांचा लाभ मिळवून देण्यासाठी मार्गदर्शन व सहकार्य करणे.\n\nकामगारांच्या हक्कांसाठी सक्षम, पारदर्शक आणि विश्वासार्ह संघटनात्मक चळवळ उभी करणे.'),
('vision','mr','आमची दृष्टी','संघटित, सुरक्षित, सन्मानाने जगणारा आणि सामाजिक न्याय मिळवणारा कामगार वर्ग निर्माण करणे.'),
('contact','mr','संपर्क','दुकान क्रमांक १२, बी विंग, कॅपिटल हाइट्स एन एक्स, भोगाळे, ता. चिपळूण, जि. रत्नागिरी, पिन कोड ४१५६०५\n9930104103 | 9359732984 | rjgku2026@gmail.com\nMonday to Saturday, 10:00 AM to 5:00 PM')
ON DUPLICATE KEY UPDATE title=VALUES(title),body=VALUES(body);
INSERT INTO public_schemes(name_mr,name_en,display_order) VALUES('शैक्षणिक शिष्यवृत्ती','Education Scholarship',1),('पदवी शिष्यवृत्ती','Degree Scholarship',2),('गृहनिर्माण योजना','Housing Scheme',3),('वैद्यकीय सहाय्य','Medical Assistance',4),('विवाह योजना','Marriage Scheme',5),('मृत्यू दावा','Death Claim',6),('अपघात दावा','Accident Claim',7),('टूल किट / कामगार कल्याण','Tool Kit / Worker Welfare Scheme',8),('इतर शासकीय कल्याणकारी योजना','Other Government Welfare Schemes',9) ON DUPLICATE KEY UPDATE name_en=VALUES(name_en);
