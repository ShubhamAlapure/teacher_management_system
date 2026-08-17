import React from 'react';
import { DocumentHeader, DocumentFooter } from './DocumentHeaderFooter';
import { formatDateForDoc } from '../utils/validation';

export const NOCTemplate = ({ data = {} }) => {
  const {
    referenceNumber = "MITADT/SOC/T&P/2026/NOC-0842",
    documentDate = new Date().toISOString().split('T')[0],
    universityName = "MIT Art, Design and Technology University",
    schoolName = "School of Computing",
    department = "Department of Computer Science & Engineering",
    universityAddress = "Rajbaug, Next to Hadapsar, Loni Kalbhor, Pune - 412201, Maharashtra, India",

    // Recipient Company Info
    companyName = "Google India Private Limited",
    companyLocation = "Prestige Cyber Earth, Whitefield, Bangalore - 560066",
    internshipRole = "Software Engineering Intern",

    // Student Info
    studentName = "Shubham Santosh Alapure",
    salutation = "Mr.",
    rollNumber = "CS2022-084",
    enrollmentNumber = "MITADT2022CS084",
    course = "B.Tech in Computer Science and Engineering",
    className = "Final Year (VIII Semester)",

    // Duration
    startDate = "2026-01-05",
    endDate = "2026-06-30",
    duration = "6 Months (Full-Time)",

    // Signatories
    internshipHeadName = "Prof. Aniket Verma",
    internshipHeadDesignation = "Head - Industry Internship Cell",
    hodName = "Dr. Sneha Deshmukh",
    hodDesignation: hodDesignation = "Head of Department (CSE)",
    directorName = "Dr. Milind S. Kulkarni",
    directorDesignation = "Director, Corporate Relations & Placement Cell"
  } = data;

  const pronoun = salutation === "Ms." || salutation === "Mrs." ? "she" : "he";
  const possessive = salutation === "Ms." || salutation === "Mrs." ? "her" : "his";
  const honorific = salutation === "Ms." || salutation === "Mrs." ? "Ms." : "Mr.";

  return (
    <div className="a4-document-paper" id="noc-document">
      {/* University Institutional Header */}
      <DocumentHeader 
        universityName={universityName || "MIT Art, Design and Technology University"} 
        schoolName={schoolName || "School of Computing"}
        department={department || "Department of Computer Science & Engineering"}
        address={universityAddress}
      />

      {/* Ref No & Date Header Line */}
      <div className="doc-ref-date-row">
        <div>
          <span>Ref. No.: </span>
          <span className="doc-dynamic-text">{referenceNumber}</span>
        </div>
        <div>
          <span>Date: </span>
          <span className="doc-dynamic-text">{formatDateForDoc(documentDate)}</span>
        </div>
      </div>

      {/* Recipient Address */}
      <div style={{ marginBottom: '14px', fontSize: '10pt', fontFamily: 'var(--font-doc-serif)' }}>
        <div>To,</div>
        <div style={{ fontWeight: '700' }}>The Human Resources Department / Internship Coordinator,</div>
        <div className="doc-dynamic-text" style={{ fontWeight: '700' }}>{companyName}</div>
        <div className="doc-dynamic-text">{companyLocation}</div>
      </div>

      {/* Main Subject / NOC Title */}
      <div className="doc-title-center-wrap">
        <div className="doc-main-title">
          NO OBJECTION CERTIFICATE FOR INTERNSHIP
        </div>
      </div>

      {/* Salutation */}
      <div style={{ marginBottom: '10px', fontSize: '10pt' }}>
        Dear Sir / Madam,
      </div>

      {/* Certification Paragraph */}
      <p className="doc-body-paragraph">
        This is to certify that <span className="doc-dynamic-text">{honorific} {studentName}</span>, bearing Roll No. <span className="doc-dynamic-text">{rollNumber}</span> and 
        University Registration / PRN No. <span className="doc-dynamic-text">{enrollmentNumber}</span> is a bona fide, full-time student of 
        the <span className="doc-dynamic-text">{course}</span> program, currently studying in <span className="doc-dynamic-text">{className}</span> at 
        the <span className="doc-dynamic-text">{department}</span>, <span className="doc-dynamic-text">{schoolName}</span>, <span className="doc-dynamic-text">{universityName}</span>.
      </p>

      <p className="doc-body-paragraph">
        The University and the School of Computing have <strong>"NO OBJECTION"</strong> to {honorific} {studentName} pursuing an industrial internship 
        with your esteemed organization, <strong>{companyName}</strong>, in the role of <span className="doc-dynamic-text">{internshipRole}</span> for 
        a period of <span className="doc-dynamic-text">{duration}</span>, commencing from <span className="doc-dynamic-text">{formatDateForDoc(startDate)}</span> to <span className="doc-dynamic-text">{formatDateForDoc(endDate)}</span>.
      </p>

      {/* Academic Attendance & Policy Statement */}
      <p className="doc-body-paragraph">
        During this internship tenure, the student is permitted to undertake full-time industry assignments and project training as an integral part of the curriculum credits. 
        The student has maintained satisfactory academic progress and exemplary disciplinary conduct. The institution encourages students to gain practical industrial exposure 
        under the mentorship of industry professionals.
      </p>

      <p className="doc-body-paragraph">
        Upon completion of the internship, the student is required to submit the official project completion certificate and performance evaluation to the department. 
        We thank you for providing this valuable learning opportunity to our student.
      </p>

      <div style={{ marginTop: '12px', fontSize: '10pt' }}>
        Thanking you,
      </div>
      <div style={{ fontSize: '10pt', fontWeight: '700', marginTop: '2px' }}>
        Yours sincerely,
      </div>

      {/* 3 Authorized Signatures Grid */}
      <div className="doc-signatures-grid">
        {/* Signatory 1: Internship Head */}
        <div className="doc-signature-box">
          <div style={{ height: '36px' }}></div>
          <div className="doc-signature-line">
            <div>{internshipHeadName}</div>
            <div className="doc-signature-title">{internshipHeadDesignation}</div>
            <div className="doc-signature-title">{schoolName}</div>
          </div>
        </div>

        {/* Signatory 2: Head of Department */}
        <div className="doc-signature-box">
          <div style={{ height: '36px' }}></div>
          <div className="doc-signature-line">
            <div>{hodName}</div>
            <div className="doc-signature-title">{hodDesignation}</div>
            <div className="doc-signature-title">{schoolName}</div>
          </div>
        </div>

        {/* Signatory 3: Director / Placement Cell */}
        <div className="doc-signature-box">
          <div style={{ height: '36px' }}></div>
          <div className="doc-signature-line">
            <div>{directorName}</div>
            <div className="doc-signature-title">{directorDesignation}</div>
            <div className="doc-signature-title">{universityName}</div>
          </div>
        </div>
      </div>

      {/* Official Stamp & Seal Area */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '14px' }}>
        <div className="doc-stamp-box" style={{ width: '220px' }}>
          <span>Official University Stamp / Seal</span>
        </div>
      </div>

      {/* University Institutional Footer */}
      <DocumentFooter 
        address={universityAddress}
        docCode={referenceNumber || "MIT-ADT/SOC/NOC-2026"}
      />
    </div>
  );
};
