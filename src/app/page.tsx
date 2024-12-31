"use client";
import React, { useState } from 'react'
import Image from 'next/image';
import Modal from '@/components/Modal';


const HomePage = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [policyType, setPolicyType] = useState("");

  const privacyPolicy = `At Open Law Forum, we respect and value your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our website. Open Law Forum is a platform where you can read and access a wide range of legal content, including the Constitution of India, Central Acts, Indian Penal Code (IPC), Code of Criminal Procedure (CrPC), and more. Please read this policy carefully to understand how your data is handled when you use our services.

1. Information We Collect
At Open Law Forum, we prioritize your privacy and only collect data that is necessary for the operation of the platform. We do not collect any personal data unless you voluntarily provide it to us when authenticating or registering an account. The following are the types of information we may collect:

1.1 Non-Personal Information
Usage Data: This includes information about your visit to the website, such as the pages you view, the time spent on each page, and your IP address. This information is automatically collected through cookies and web analytics tools, and is used to improve the performance of the website.
1.2 Personal Information
User Credentials: When you choose to authenticate or register an account on Open Law Forum, we collect basic personal information such as your username and password. This information is stored securely and is used to facilitate account login and provide a personalized experience.

Note: We do not collect sensitive personal information (e.g., financial data, government identification numbers).

1.3 Advertising Data
Cookies and Tracking Technologies: We use cookies and similar technologies to gather data for advertising purposes. This may include tracking your behavior on the site for the purpose of serving relevant advertisements.
2. How We Use Your Information
The information we collect is used for the following purposes:

2.1 Account Management
User Authentication: The personal data provided during authentication (username and password) is used solely to enable you to log in and access the platform. We may use this data to provide account-related support, notifications, and communications related to your account.
2.2 Improving Website Functionality
Website Analytics: Non-personal information such as usage data is used to analyze trends, track user activity, and improve the functionality of our website. This allows us to enhance the user experience by optimizing content and site navigation.
2.3 Advertisement Personalization
Targeted Advertising: Cookies and tracking technologies may be used to display relevant advertisements based on your browsing behavior. The data we collect for advertising purposes is anonymized and does not personally identify you. We may partner with third-party ad networks to serve ads that are relevant to your interests.
2.4 Legal Compliance
We may use your information to comply with applicable laws, regulations, and legal obligations, including responding to legal requests or enforcement activities.
3. How We Protect Your Information
We implement industry-standard security measures to protect your personal data, including encryption and access control procedures. However, please note that no method of data transmission over the internet or electronic storage is completely secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.

3.1 Data Retention
We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, including for legal, accounting, or reporting purposes. If you choose to delete your account, we will retain certain information as required by law.

4. Sharing Your Information
Open Law Forum does not sell, rent, or trade your personal information to third parties. We may share your information only in the following circumstances:

4.1 Service Providers
We may share your data with third-party service providers who perform services on our behalf (such as hosting, payment processing, analytics, and advertising). These service providers are contractually obligated to protect your information and may only use it for the purposes for which it was provided.

4.2 Legal Requirements
We may disclose your personal information if required by law, regulation, or legal process, such as in response to a subpoena or court order, or if we believe that such action is necessary to comply with legal obligations or protect our rights.

4.3 Advertising Partners
We may share anonymized usage data with advertising partners to help serve targeted advertisements. This data does not personally identify you but is used to provide more relevant ads based on your browsing behavior.

5. User Rights
As a user of Open Law Forum, you have the following rights regarding your personal data:

5.1 Access and Correction
You may request access to your personal data that we hold and request corrections or updates to it. If you wish to review, correct, or delete your account information, please contact us through our contact information below.

5.2 Account Deletion
If you wish to delete your account, you can do so by following the instructions on the platform or contacting us directly. Please note that some data may be retained as necessary for legal or business purposes.

5.3 Opting Out of Advertising
You can manage or opt out of targeted advertising through your browser settings or by visiting the opt-out pages provided by advertising networks. Please note that opting out may result in seeing less relevant ads, but you will still see generic ads.

6. Children's Privacy
Open Law Forum is not intended for children under the age of 13. We do not knowingly collect or solicit personal information from children under the age of 13. If you are a parent or guardian and believe that your child has provided us with personal data, please contact us, and we will take steps to delete such information.

7. Changes to This Privacy Policy
We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When we make changes, we will revise the "last updated" date at the top of this page. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.

8. Contact Us
If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at: sksandeep443@gmail.com`;
  const contentPolicy = `Welcome to Open Law Forum – a platform where you can access various legal resources, including the Constitution of India, Central Acts, Indian Penal Code (IPC), Code of Criminal Procedure (CrPC), and many other legal documents. This Content Policy outlines how you may use the content provided on our platform and the responsibilities that come with it. By using our platform, you agree to adhere to the following terms and conditions:

1. Content Availability
The Open Law Forum provides free access to articles, sections, and full texts of the Constitution of India, Central Acts, Indian Penal Code (IPC), Code of Criminal Procedure (CrPC), and other legal documents to give you insight into the Indian legal system. The materials on the platform are intended for informational and educational purposes only and are designed to help users better understand legal principles, statutes, and regulations.

2. Accuracy of Information
While we strive to ensure that the content available on the platform is accurate, up-to-date, and comprehensive, we do not guarantee the absolute accuracy, completeness, or relevance of the legal documents and information provided. Laws and regulations may be amended, and interpretations may evolve over time. It is your responsibility to verify the information through official channels or consult legal professionals for accurate advice or interpretation.

3. No Legal Advice
The content available on the Open Law Forum is not intended to serve as legal advice. The information provided is for general educational purposes and should not be considered as a substitute for legal counsel. Users should consult a qualified legal professional for advice regarding their specific legal situation or any concerns about the law.

4. Use of Content
Users are free to read, review, and refer to the content available on the platform for personal educational purposes. However, reproduction, distribution, or commercial use of the content in any form is prohibited unless explicitly authorized by Open Law Forum.

Personal Use: Users may access and utilize the content for self-education, personal research, or study.
Prohibited Use: Unauthorized use of the content for commercial purposes, including but not limited to copying, selling, distributing, or exploiting the material in any manner is strictly prohibited.
5. Responsibility for Use
While Open Law Forum offers access to legal content, it is the responsibility of the user to ensure they use the information appropriately. We disclaim any liability for how users apply, interpret, or act upon the information found on the platform. Any legal decision or action taken based on the content is at the user's own discretion and risk.

User Accountability: Users are solely responsible for how they use the information available on the site.
No Liability: Open Law Forum will not be held responsible for any legal or other consequences that arise from the use of the content.
6. User Behavior and Conduct
By using this platform, you agree to act responsibly and ethically when accessing the content. You are prohibited from engaging in any unlawful, abusive, or inappropriate behavior on the platform. The following activities are strictly prohibited:

Violating any laws in your jurisdiction.
Disseminating harmful or defamatory content.
Accessing or attempting to access content that violates any third-party rights.
We reserve the right to remove any content or suspend accounts that violate the terms of this policy.

7. No Validation or Endorsement
The information on Open Law Forum is not validated or endorsed by any official legal body or authority. While we strive to provide reliable resources, we do not claim that the content reflects the official interpretation of the law. The materials are offered as-is, and users should always consult official government sources or legal experts for authoritative information.

8. Changes to Content Policy
Open Law Forum reserves the right to update, modify, or revise this Content Policy at any time. We will make efforts to inform users of any significant changes, but it is the user’s responsibility to review this policy periodically for updates.

9. Privacy and Data Protection
We value your privacy. When using our platform, any personal information shared with us will be handled according to our Privacy Policy. By using this platform, you agree to comply with the terms outlined in the Privacy Policy.

10. Termination
Open Law Forum reserves the right to suspend or terminate your access to the platform at any time without notice if we believe you have violated the terms of this policy or engaged in any illegal or unethical behavior.

11. Disclaimer
No warranty or guarantee: The platform makes no representations or warranties regarding the completeness, accuracy, or applicability of the information.
Use at your own risk: Access to and use of the content on Open Law Forum is at your own risk, and we are not responsible for any errors or omissions in the content provided.
12. Governing Law
This Content Policy is governed by and construed in accordance with the laws of India. Any dispute arising from the use of this platform shall be subject to the exclusive jurisdiction of the courts in New Delhi.`;

  const openPolicy = (type: React.SetStateAction<string>) => {
    setPolicyType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPolicyType("");
  };

  const getPolicyContent = () => {
    if (policyType === "privacy") return privacyPolicy;
    if (policyType === "content") return contentPolicy;
    return "";
  };

  return (
    <div className="w-full h-full flex flex-col">
      <main className="flex-1">
        <div className="py-8">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 overflow-x-auto whitespace-nowrap auto-scroll">
            <p className="text-center">
              <strong>Notice:</strong> This portal is for general information
              and awareness about the Indian Constitution. It is not a legal
              document.
            </p>
          </div>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-center mb-6">
              Welcome to the Constitution of India Information Portal
            </h2>
            <p className="text-lg text-gray-700 mb-6 text-center">
              Explore the various sections and articles of the Indian
              Constitution. Gain insights into the laws that govern the
              country.
            </p>
            <div className="w-[200px] h-[200px] justify-center mx-auto p-10">
              <Image
                src="/reshot-icon-india-YAP234SRF6.svg"
                alt="India Map"
                width={96}
                height={96}
                className="mx-auto"
              />
            </div>
            <div>

              

          </div>
        </div>
       
              <div className='flex p-4'>
                <ul className='flex w-full justify-between bg-white p-2 rounded-md'>
                  <li className='bg-red-600 rounded p-1 text-white'>
                    <a href="#" onClick={() => openPolicy("privacy")}>
                      Privacy Policy
                    </a>
                  </li>
                  <p className='sm:ml-2 text-lime-800 font-bold'>Click to read our policies</p>
                  <li className='bg-red-600 rounded p-1 text-white'>
                    <a href="#" onClick={() => openPolicy("content")}>
                      Content Policy
                    </a>
                  </li>
                </ul>
              </div>

              {isModalOpen && (
                <Modal onClose={closeModal} policyContent={getPolicyContent()} />
              )}
            </div>
      </main>
      

    </div>
  )
}

export default HomePage
