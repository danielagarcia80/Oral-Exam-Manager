import React, { useState } from 'react';

interface LanguageSelectorProps {
  onLanguageSelect: (value: string) => void;
}

export default function LanguageSelector({ onLanguageSelect }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(''); // state to store selected language

  const languages = [
    { name: 'java', image: '/Images/Java.svg' },
    { name: 'c++', image: '/Images/C++.svg' },
    { name: 'python', image: '/Images/python.svg' },
    { name: 'javaScript', image: '/Images/js.svg' },
  ];

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    onLanguageSelect(language);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '20px' }}>
        {languages.map((lang) => (
          <div
            key={lang.name}
            onClick={() => handleLanguageSelect(lang.name)}
            style={{
              cursor: 'pointer',
              border: selectedLanguage === lang.name ? '3px solid blue' : '1px solid gray',
            }}
          >
            <img src={lang.image} alt={lang.name} style={{ width: '110px', height: '110px' }} />
          </div>
        ))}
      </div>
    </>
  );
}
