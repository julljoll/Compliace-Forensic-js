---
tipo_instrumento: "Norma"
nombre_oficial: "NIST Special Publication 800-101 Revision 1"
gaceta_oficial: ""
fecha_publicacion: ""
articulos_detectados: 0
categorias: ["informatico", "constitucional", "internacional"]
hash_pdf_sha256: "efd3f02258276fb294d62a73bb0a6ec80051fd625d5197584220beaface31718"
autor_procesamiento: "Jull Ortiz (Arquitecto de Información IA y bases de datos vectoriales)"
sistema: "IBM Docling + LegalProcessor v2"
version_md: "2.0"
procesado_en: "2026-06-29T17:26:02"
---
# 🏛️ PROCESAMIENTO ESTRUCTURADO DE NORMATIVAS Y LEYES

> [!NOTE]
> **DERECHOS DE AUTOR Y LICENCIA MIT**
>
> Este archivo de texto estructurado ha sido generado y optimizado automáticamente para su consumo por sistemas de Inteligencia Artificial (RAG).
> 
> * **Creador:** Jull Ortiz (Arquitecto de Información IA y bases de datos vectoriales)
> * **Propósito:** Avanzar en la transformación tecnológica del sistema de justicia venezolano.
> * **Licencia:** MIT License
> * **Copyright (c) 2026 Jull Ortiz**
>
> Se concede permiso por la presente, sin cargo, a cualquier persona que obtenga una copia de este software y de los archivos de documentación asociados, para utilizarlo sin restricciones, incluyendo el derecho a usar, copiar, modificar, fusionar y publicar. El aviso de copyright anterior y este aviso de permiso se incluirán en todas las copias o partes sustanciales del archivo.

---

## NIST Special Publication 800-101 Revision 1

## Guidelines on Mobile Device Forensics

Rick Ayers Sam Brothers Wayne Jansen

http://dx.doi.org/10.6028/NIST.SP.800-101r1

NIST

<!-- image -->

## NIST Special Publication 800-101 Revision 1

## Guidelines on Mobile Device Forensics

Rick Ayers Software and Systems Division Information Technology Laboratory

Sam Brothers U.S. Customs and Border Protection Department of Homeland Security Springfield, VA

Wayne Jansen Booz Allen Hamilton McLean, VA

http://dx.doi.org/10.6028/NIST.SP. 800-101r1

May 2014

<!-- image -->

U.S. Department of Commerce Penny Pritzker, Secretary

National Institute of Standards and Technology

Patrick D. Gallagher, Under Secretary of Commerce for Standards and Technology and Director

## Authority

This publication has been developed by NIST in accordance with its statutory responsibilities under the Federal Information Security Management Act of 2002 (FISMA), 44 U.S.C. § 3541 et seq., Public Law (P.L.) 107-347. NIST is responsible for developing information security standards and guidelines, including minimum requirements for Federal information systems, but such standards and guidelines shall not apply to national security systems without the express approval of appropriate Federal officials exercising policy authority over such systems. This guideline is consistent with the requirements of the Office of Management and Budget (OMB) Circular A-130, Section 8b(3), Securing Agency Information Systems , as analyzed in Circular A130, Appendix IV: Analysis of Key Sections . Supplemental information is provided in Circular A130, Appendix III, Security of Federal Automated Information Resources .

Nothing in this publication should be taken to contradict the standards and guidelines made mandatory and binding on Federal agencies by the Secretary of Commerce under statutory authority. Nor should these guidelines be interpreted as altering or superseding the existing authorities of the Secretary of Commerce, Director of the OMB, or any other Federal official. This publication may be used by nongovernmental organizations on a voluntary basis and is not subject to copyright in the United States. Attribution would, however, be appreciated by NIST.

National Institute of Standards and Technology Special Publication 800-101r1 Natl. Inst. Stand. Technol. Spec. Publ. 800-101 Revision 1, 87 pages (May 2014) http://dx.doi.org/10.6028/NIST.SP. 800-101r1 CODEN: NSPUE2

Certain commercial entities, equipment, or materials may be identified in this document in order to describe an experimental procedure or concept adequately. Such identification is not intended to imply recommendation or endorsement by NIST, nor is it intended to imply that the entities, materials, or equipment are necessarily the best available for the purpose.

There may be references in this publication to other publications currently under development by NIST in accordance with its assigned statutory responsibilities. The information in this publication, including concepts and methodologies, may be used by Federal agencies even before the completion of such companion publications. Thus, until each publication is completed, current requirements, guidelines, and procedures, where they exist, remain operative. For planning and transition purposes, Federal agencies may wish to closely follow the development of these new publications by NIST.

Organizations are encouraged to review all draft publications during public comment periods and provide feedback to NIST. All NIST Computer Security Division publications, other than the ones noted above, are available at http://csrc.nist.gov/publications.

## Reports on Computer Systems Technology

The Information Technology Laboratory (ITL) at the National Institute of Standards and Technology (NIST) promotes the U.S. economy and public welfare by providing technical leadership for the Nation's measurement and standards infrastructure. ITL develops tests, test methods, reference data, proof of concept implementations, and technical analyses to advance the development and productive use of information technology. ITL's responsibilities include the development of management, administrative, technical, and physical standards and guidelines for the cost-effective security and privacy of other than national security-related information in Federal information systems. The Special Publication 800-series reports on ITL's research, guidelines, and outreach efforts in information system security, and its collaborative activities with industry, government, and academic organizations.

## Abstract

Mobile device forensics is the science of recovering digital evidence from a mobile device under forensically sound conditions using accepted methods. Mobile device forensics is an evolving specialty in the field of digital forensics. This guide attempts to bridge the gap by providing an indepth look into mobile devices and explaining technologies involved and their relationship to forensic procedures. This document covers mobile devices with features beyond simple voice communication and text messaging capabilities. This guide also discusses procedures for the validation, preservation, acquisition, examination, analysis, and reporting of digital information.

## Keywords

cell phone forensics; forensic tools; mobile devices; mobile device forensics; mobile device tools; smart phones

## Acknowledgements

The authors, Rick Ayers from NIST, Sam Brothers from U.S. Customs and Border Protection and Wayne Jansen from Booz-Allen-Hamilton, wish to thank colleagues who reviewed drafts of this document. In particular, our appreciation goes to Barbara Guttman from NIST and Simson Garfinkle from the Naval Postgraduate School for their technical support and written contributions to this document.

Our appreciation also goes out to Bob Elder from TeelTech Canada, Gary Kessler from Gary Kessler Associates, Rick Mislan from Rochester Institute of Technology and Daren Melson for their assistance on technical issues that arose in our work. The authors would also like to thank all others who assisted with our review process.

| Table of Contents                                                                                                                      | Table of Contents                                                                                                                      |                                                                                                         |
|----------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| TABLE OFCONTENTS.............................................................................................................V         | TABLE OFCONTENTS.............................................................................................................V         |                                                                                                         |
| LIST OF FIGURES....................................................................................................................VII | LIST OF FIGURES....................................................................................................................VII |                                                                                                         |
| LIST OFTABLES....................................................................................................................      | LIST OFTABLES....................................................................................................................      | VIII                                                                                                    |
| EXECUTIVE SUMMARY...........................................................................................................           | EXECUTIVE SUMMARY...........................................................................................................           | 1                                                                                                       |
| 1. INTRODUCTION..................................................................................................................      | 1. INTRODUCTION..................................................................................................................      | 1                                                                                                       |
| 1.1                                                                                                                                    | PURPOSEAND SCOPE .........................................................................................................             | 1                                                                                                       |
| 1.2                                                                                                                                    | AUDIENCEAND ASSUMPTIONS ..........................................................................................                     | 1                                                                                                       |
| 1.3                                                                                                                                    | DOCUMENT STRUCTURE....................................................................................................                 | 1                                                                                                       |
| 2. BACKGROUND....................................................................................................................      | 2. BACKGROUND....................................................................................................................      | 3                                                                                                       |
| 2.1                                                                                                                                    | MOBILE DEVICE CHARACTERISTICS .................................................................................                        | 3                                                                                                       |
| 2.2                                                                                                                                    | MEMORY CONSIDERATIONS ..............................................................................................                   | 5                                                                                                       |
| 2.3                                                                                                                                    | IDENTITY MODULE CHARACTERISTICS .............................................................................                          | 7                                                                                                       |
| 2.4                                                                                                                                    | CELLULAR NETWORK CHARACTERISTICS.......................................................................10                              |                                                                                                         |
| 2.5                                                                                                                                    | OTHER COMMUNICATIONS SYSTEMS                                                                                                           | ..............................................................................12                        |
| 3. FORENSIC TOOLS.............................................................................................................15       | 3. FORENSIC TOOLS.............................................................................................................15       |                                                                                                         |
| 3.1                                                                                                                                    | MOBILE DEVICE TOOL CLASSIFICATION SYSTEM ..........................................................                                    | 15                                                                                                      |
| 3.2                                                                                                                                    | UICCTOOLS....................................................................................................................          | 23                                                                                                      |
| 3.3                                                                                                                                    | OBSTRUCTED DEVICES ....................................................................................................24              |                                                                                                         |
| 3.4                                                                                                                                    | FORENSIC TOOL CAPABILITIES ........................................................................................                    | 25                                                                                                      |
| 4. PRESERVATION................................................................................................................        | 4. PRESERVATION................................................................................................................        | 27                                                                                                      |
| 4.1                                                                                                                                    | SECURINGAND EVALUATINGTHE SCENE .......................................................................27                              |                                                                                                         |
| 4.2                                                                                                                                    | DOCUMENTINGTHE SCENE..............................................................................................                     | 28                                                                                                      |
| 4.3                                                                                                                                    | ISOLATION ........................................................................................................................     | 28                                                                                                      |
| 4.4                                                                                                                                    | PACKAGING, TRANSPORTING, AND STORING EVIDENCE ................................................                                         | 33                                                                                                      |
| 4.5                                                                                                                                    | ON-SITE TRIAGE PROCESSING.........................................................................................                     | 33                                                                                                      |
| 4.6                                                                                                                                    | GENERIC ON-SITE DECISION TREE..................................................................................                        | 35                                                                                                      |
| 5. ACQUISITION ....................................................................................................................    | 5. ACQUISITION ....................................................................................................................    | 37                                                                                                      |
| 5.1                                                                                                                                    | MOBILE DEVICE I DENTIFICATION ...................................................................................                      | 37                                                                                                      |
| 5.2                                                                                                                                    | TOOL SELECTIONAND EXPECTATIONS ...........................................................................39                           |                                                                                                         |
| 5.3                                                                                                                                    | MOBILE DEVICE MEMORY ACQUISITION........................................................................40                             |                                                                                                         |
| 5.4                                                                                                                                    | TANGENTIAL EQUIPMENT................................................................................................                   | 45                                                                                                      |
| 5.5                                                                                                                                    | CLOUD BASED SERVICES FOR MOBILE DEVICES ............................................................                                   | 46                                                                                                      |
| 6. EXAMINATION ANDANALYSIS..................................................................................                           | 6. EXAMINATION ANDANALYSIS..................................................................................                           | 48                                                                                                      |
| 6.1                                                                                                                                    | POTENTIAL EVIDENCE                                                                                                                     | .....................................................................................................48 |
| 6.2                                                                                                                                    | APPLYING MOBILE DEVICE FORENSIC TOOLS ................................................................                                 | 50                                                                                                      |
| 6.3                                                                                                                                    | CALLAND SUBSCRIBER RECORDS...................................................................................                          | 52                                                                                                      |

| 7.                                                                                                                                                                                                                                                    | REPORTING........................................................................................................................ 55                                                                                                                  | REPORTING........................................................................................................................ 55   |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| 8.                                                                                                                                                                                                                                                    | REFERENCES..................................................................................................................... 58                                                                                                                    | REFERENCES..................................................................................................................... 58     |
| 8.1                                                                                                                                                                                                                                                   | 8.1                                                                                                                                                                                                                                                   | 58                                                                                                                                     |
| BIBLIOGRAPHIC CITATIONS ............................................................................................. 8.2 FOOTNOTED URLS ..........................................................................................................62 | BIBLIOGRAPHIC CITATIONS ............................................................................................. 8.2 FOOTNOTED URLS ..........................................................................................................62 |                                                                                                                                        |
| APPENDIX A. ACRONYMS....................................................................................................64                                                                                                                            | APPENDIX A. ACRONYMS....................................................................................................64                                                                                                                            | APPENDIX A. ACRONYMS....................................................................................................64             |
| APPENDIX B. GLOSSARY......................................................................................................67                                                                                                                          | APPENDIX B. GLOSSARY......................................................................................................67                                                                                                                          | APPENDIX B. GLOSSARY......................................................................................................67           |
| APPENDIX C. STANDARDIZED CALLRECORDS........................................................... 72                                                                                                                                                    | APPENDIX C. STANDARDIZED CALLRECORDS........................................................... 72                                                                                                                                                    | APPENDIX C. STANDARDIZED CALLRECORDS........................................................... 72                                     |
| APPENDIX D. ONLINE RESOURCES FOR MOBILE DEVICE FORENSICS.................                                                                                                                                                                             | APPENDIX D. ONLINE RESOURCES FOR MOBILE DEVICE FORENSICS.................                                                                                                                                                                             | APPENDIX D. ONLINE RESOURCES FOR MOBILE DEVICE FORENSICS.................                                                              |

## List of Figures

| Figure 1: Memory Configurations......................................   |   6 |
|-------------------------------------------------------------------------|-----|
| Figure 2: SIM Card Size Formats [Orm09] .......................         |   8 |
| Figure 3: SIM File System (GSM).....................................    |   9 |
| Figure 4: Cellular Network Organization.........................        |  12 |
| Figure 5: Satellite Phone Network....................................   |  13 |
| Figure 6: Mobile Device Tool Classification System......                |  17 |
| Figure 7: Generic Triage Decision Tree...........................       |  36 |

## List of Tables

| Table 1: Hardware Characterization...................................      |   4 |
|----------------------------------------------------------------------------|-----|
| Table 2: Software Characterization ....................................    |   5 |
| Table 3: Mobile Device Forensic Tools...........................           |  21 |
| Table 4: Memory Cards..................................................... |  46 |
| Table 5: Example Record Structure..................................        |  72 |
| Table 6: Technical Resource Sites....................................      |  75 |
| Table 7: Databases for Identification Queries..................            |  75 |

## Executive Summary

The  digital  forensic  community  faces  a  constant  challenge  to  stay  abreast  of  the  latest technologies that may be used to expose relevant clues in an investigation. Mobile devices are commonplace in today's society, used by many individuals for both personal and professional purposes. Mobile devices vary in design and are continually undergoing change as existing technologies  improve  and  new  technologies  are  introduced.  When  a  mobile  device  is encountered  during  an  investigation,  many  questions  arise:    What  is  the  best  method  to preserve  the  evidence?    How  should  the  device  be  handled?    How  should  valuable  or potentially relevant data contained on the device be extracted?  The key to answering these questions  begins  with a  firm  understanding  of  the  hardware  and  software  characteristics  of mobile devices. This guide discusses procedures for the preservation, acquisition, examination, analysis,  and  reporting  of  digital  evidence.  The  issue  of  ever  increasing  backlogs  for  most digital  forensics  labs  is  addressed  and  guidance  is  provided  on  handling  on-site  triage casework.

The objective of the guide is twofold: to help organizations evolve appropriate policies and procedures  for  dealing  with  mobile  devices  and  to  prepare  forensic  specialists  to  conduct forensically sound examinations involving mobile devices. This guide is not all-inclusive nor is  it  prescribing  how  law  enforcement  and  incident  response  communities  should  handle mobile devices during their investigations or incidents. Specific vendors and mobile forensic acquisition  guidance  is  not  specified.  However,  from  the  principles  outlined  and  other information provided, organizations should find this guide helpful in establishing their policies and procedures. This publication should not be construed as legal advice. Organizations should use this guide as a starting point for developing a forensic capability in conjunction with proper technical training and extensive guidance provided by legal advisors, officials, and management.  This  guide  is  the  first  revision  to  NIST  SP800-101.  While  much  of  the information provided herein has been carried over from the original guide, the material has been updated and augmented to reflect the current state of the discipline.

## 1. Introduction

## 1.1 Purpose and Scope

This  guide  provides  basic  information  on  mobile  forensics  tools  and  the  preservation, acquisition,  examination  and  analysis,  and  reporting  of  digital  evidence  present  on  mobile devices. This information is relevant to law enforcement, incident response and other types of investigations.  This  guide  focuses  mainly  on  the  characteristics  of  cellular  mobile  devices, including  feature  phones,  smartphones,  and  tablets  with  cellular  voice  capabilities.  It  also covers provisions to be taken into consideration during the course of an incident investigation.

This  guide  is  intended  to  address  common  circumstances  that  may  be  encountered  by organizational security staff and law enforcement investigators involving digital electronic data residing on mobile devices and associated electronic media. It is also intended to complement existing  guidelines  and  delve  more  deeply  into  issues  related  to  mobile  devices  and  their examination and analysis.

Procedures  and  techniques  presented  in  this  document  are  a  compilation  of  best  practices within the discipline and references have been taken from existing forensic guidelines. This publication  is  not  to  be  used  as  a  step-by-step  guide  for  executing  a  proper  forensic investigation when dealing with mobile devices nor construed as legal advice. Its purpose is to inform readers of the various technologies involved and potential ways to approach them from a forensic point of view. Readers are advised to apply the recommended practices only after consultation with management and legal officials for compliance with laws and regulations (i.e., local, state, federal, and international) that are applicable.

## 1.2 Audience and Assumptions

The  intended  audience  is  varied  and  ranges  from  forensic  examiners  to  response  team members handling a computer security incident to organizational security officials investigating  an  employee-related  incident.  The  practices  recommended  in  this  guide  are designed to highlight key technical principles associated with the handling and examination of mobile  devices.  Readers  are  assumed  to  have  a  basic  understanding  of  traditional  digital forensic methodologies and capabilities involving stand-alone computers. Due to the changing nature of mobile devices and their related forensic procedures and tools, readers are expected to be aware of and employ additional resources for the most current information.

## 1.3 Document Structure

The guide is divided into the following chapters and appendices:

-  Chapter 1 explains the authority, purpose and scope, audience and assumptions of the document and outlines its structure.
-  Chapter 2 provides a background on mobile device characteristics, the internal memory of mobile devices, and characteristics of identity modules and cellular networks.

-  Chapter 3 discusses the mobile device forensic tool classification system, methods for handling obstructed devices and the capabilities of forensic tools.
-  Chapter 4 discusses considerations for preserving digital evidence associated with mobile devices and techniques for preventing network communication.
-  Chapter 5 examines the process of mobile device and identity module data acquisition, tangential equipment and cloud-based services for mobile devices.
-  Chapter 6 outlines the examination and analysis process, common sources of evidence extracted from mobile devices and identity modules, features and capabilities of tools for examination and call/subscriber records.
-  Chapter 7 discusses an overview of report creation and the reporting of findings.
-  Chapter 8 contains a list of references used in this guide.
-  Appendix A contains a list of acronyms used in this guide.
-  Appendix B contains a glossary defining terms used in this guide.
-  Appendix C provides an example of the structure of call records maintained by cell phone carriers.
-  Appendix D provides links to online resources.

## 2. Background

This chapter gives an overview of the hardware and software capabilities of mobile devices and  their  associated  cellular  networks.  The  overview  provides  a  summary  of  general characteristics and, where useful, focuses on key features relevant to forensics. Developing an understanding of the  components  and  organization  of mobile devices (e.g.,  memory organization  and  its  use)  is  a  prerequisite  to  understanding  the  intricacies  involved  when dealing with them forensically. For example, mobile device memory that contains user data may  be  volatile  (i.e.,  DRAM/SRAM)  and  require  continuous  power  to  maintain  content similar  to  RAM  in  a  personal  computer.  Similarly,  features  of  cellular  networks  are  an important  aspect  of  mobile  device  forensics,  since  logs  of  usage,  geographic  location,  and other  data  are  maintained.  Mobile  device  technologies  and  cellular  networks  are  rapidly changing, with new technologies, products, and features being introduced regularly. Because of the fast pace with which mobile device technologies are evolving, this discussion captures a snapshot of the mobile device discipline at the present time.

## 2.1 Mobile Device Characteristics

Mobile devices perform an array of functions ranging from a simple telephony device to those of a personal computer. Designed for mobility, they are compact in size, battery-powered, and lightweight.  Most  mobile  devices  have  a  basic  set  of  comparable  features  and  capabilities. They house a microprocessor, read only memory (ROM), random access memory (RAM), a radio module, a digital signal processor, a microphone and speaker, a variety of hardware keys and  interfaces  and  a  liquid  crystal  display  (LCD).  The  operating  system  (OS)  of  a  mobile device may be stored in either NAND or NOR memory while code execution typically occurs in RAM.

Currently,  mobile  devices  are  equipped  with  system-level  microprocessors  that  reduce  the number  of  supporting  chips  required  and  include  considerable  internal  memory  capacity currently up to 64GB (e.g., Stacked NAND). Built-in Secure Digital (SD) memory card slots, such  as  one  for  the  micro  Secure  Digital  eXtended  Capacity  (microSDXC),  may  support removable  memory  with  capacities  ranging  from  64GB  to  2TB  of  storage.  Non-cellular wireless communications such as infrared (i.e., IrDA), Bluetooth, Near Field Communication (NFC), and WiFi may also be built into the device and support synchronization protocols to exchange other data (e.g., graphics, audio, and video file formats).

Different  mobile  devices  have  different  technical  and  physical  characteristics  (e.g.,  size, weight, processor speed, memory capacity). Mobile devices may also use different types of expansion capabilities to provide additional functionality. Furthermore, mobile device capabilities  sometimes  include  those  of  other  devices  such  as  handheld  Global  Positioning Systems (GPS), cameras (still and video) or personal computers. Overall, mobile devices can be classified as feature phones that are primarily simple voice and messaging communication devices  or  smartphones  that  offer  more  advanced  capabilities  and  services  for  multimedia, similar to those of a personal computer. Table 1 highlights the general hardware characteristics of feature and smartphone models, which underscore this diversity.

The classification scheme is illustrative and intended to give a sense of the range of hardware characteristics currently in the marketplace. Over time, characteristics found in smartphones tend to appear in feature phones as new technology is introduced to smartphones. Though the lines of delineation are somewhat fuzzy and dynamic, the classification scheme nevertheless serves as a general guide.

Table 1: Hardware Characterization

| Feature                                        | Phone                                                        | Smartphone     |
|------------------------------------------------|--------------------------------------------------------------|----------------|
| Limited speed (~52Mhz)                         | Superior speed (~1GHz dual-core)                             | Processor      |
| Limited capacity (~5MB)                        | Superior capacity (~128GB)                                   | Memory         |
| Small size color, 4k - 260k (12-bit to 18-bit) | Large size color, 16.7 million (~24-bit)                     | Display        |
| None, MicroSD                                  | MicroSDXC                                                    | Card Slots     |
| Still, Video                                   | Still, Panoramic, and Video (HD)                             | Camera         |
| Numeric Keypad, QWERTY-style keyboard          | Touch Screen, Handwriting Recognition, QWERTY-style keyboard | Text Input     |
| None                                           | Voice Recognition (Dialing and Control)                      | Voice Input    |
| Voice and Limited Data                         | Voice and High Speed Data (4G LTE)                           | Cell Interface |
| None,GPS receiver                              | GPS receiver                                                 | Positioning    |
| IrDA, Bluetooth                                | Bluetooth, WiFi, andNFC                                      | Wireless       |
| Fixed/Removable, Rechargeable Li-Ion Polymer   | Fixed/Removable, Rechargeable Li-Ion Polymer                 | Battery        |

Both  feature  phones  and  smartphones  support  voice,  text  messaging,  and  a  set  of  basic Personal Information Management (PIM) type applications including phonebook and calendar facilities.  Smartphones  add  PC-like  capability  for  running  a  wide  variety  of  general  and special-purpose  applications.  Smartphones  are  typically  larger  than  feature  phones,  support higher video resolutions (e.g., ~300 PPI) and may have an integrated QWERTY keyboard or touch sensitive screen. Smartphones generally support a wide array of applications, available through an application storefront. Table 2 lists the differences in software capabilities found on these device classes.

Table 2: Software Characterization

| Feature                               | Phone                                                            | Smartphone                        |
|---------------------------------------|------------------------------------------------------------------|-----------------------------------|
| Closed                                | Android, BlackBerry OS, iOS, Symbian, WebOS and Windows Phone    | OS                                |
| Phonebook, Calendar and Reminder List | Enhanced Phonebook, Calendar and Reminder List                   | (Personal Information Management) |
| Minimal (e.g., games, notepad)        | Applications (e.g., games, office productivity and social media) | Applications                      |
| Voice                                 | Voice, Video                                                     | Call                              |
| Text Messaging,MMS                    | Text, Enhanced Text, Full Multimedia Messaging                   | Messaging                         |
| Instant Messaging                     | Enhanced Instant Messaging                                       | Chat                              |
| Via text messaging                    | Via POPor IMAP Server                                            | Email                             |
| ViaWAPGateway                         | Direct HTTP                                                      | Web                               |

Feature phones typically use a closed operating system with no published documentation. A number of companies specializing in embedded software also offer real-time operating system solutions for manufacturers of mobile devices. Smartphones generally use either a proprietary or an open source operating system. Nearly all smartphones use one of the following operating systems:  Android,  BlackBerry  OS,  iOS,  Symbian,  WebOS  or  Windows  Phone.  Unlike the more limited  kernels  in  feature  phones,  these  operating  systems  are  multi-tasking  and  fullfeatured,  designed  specifically  to  match  the  capabilities  of  high-end  mobile  devices.  Many smartphone operating systems manufacturers offer a Software Development Kit (SDK) (e.g., the Android 1 or iOS 2 SDKs).

## 2.2 Memory Considerations

Mobile devices contain both non-volatile and volatile memory. Volatile memory (i.e., RAM) is used for dynamic storage and its contents are lost when power is drained from the mobile device. Non-volatile memory is persistent as its contents are not affected by loss of power or overwriting data upon reboot. For example, solid-state drives (SSD) that stores persistent data on solid-state flash memory.

Mobile  devices  typically  contain  one  or  two  different  types  of  non-volatile  flash  memory. These types are NAND and NOR. NOR flash has faster read times, slower write times than NAND and is nearly immune to corruption and bad blocks while allowing random access to any memory location. NAND flash offers higher memory storage capacities, is less stable and only allows sequential access.

1 For more information, visit: http://developer.android.com/sdk/index.html

2 For more information, visit: https://developer.apple.com/devcenter/ios/index.action

Memory configurations among mobile devices have evolved over time. Feature phones were among the first types of devices that contained NOR flash and RAM memory. System and user data are stored in NOR and copied to RAM upon booting for faster code execution and access. This is known as the first generation of mobile device memory configurations.

As  smartphones  were  introduced,  memory  configurations  evolved,  adding  NAND  flash memory. This arrangement of NOR, NAND and RAM memory is referred to as the second generation. This generation of memory configurations stores system files in NOR flash, user files in NAND and RAM is used for code execution.

The latest smartphones contain only NAND and RAM memory (i.e., third generation), due to requirements for higher transaction speed, greater storage density and lower cost. To facilitate the  lack  of  space  on  mobile  device  mainboards  and  the  demand  for  higher  density  storage space (i.e.,  2GB  -  128GB) the new Embedded MultiMedia Cards (eMMC) style chips are present in many of today's smartphones.

Figure 1 illustrates the various memory configurations contained across all mobile devices.

Figure 1: Memory Configurations

<!-- image -->

RAM is the  most  difficult  to  capture  accurately  due  to  its  volatile  nature.  Since  RAM  is typically  used  for  program  execution,  information  may  be  of  value  to  the  examiner  (e.g., configuration files, passwords, etc.). Mobile device RAM capture tools are just beginning to become available.

NOR flash memory includes system data such as: operating system code, the kernel, device drivers, system libraries, memory for executing operating system applications and the storage of  user  application  execution  instructions.  NOR  flash  will  be  the  best  location  for  data collection for first generation memory configuration devices.

NAND flash memory contains: PIM data, graphics, audio, video, and other user files. This type of memory generally provides the examiner with the most useful information in most cases.  NAND  flash  memory  may  leave  multiple  copies  of  transaction-based  files  (e.g., databases and logs) due to wear leveling algorithms and garbage collection routines. Since NAND flash  memory  cells  can  be  re-used  for  only  a  limited  amount  of  time  before  they become unreliable, wear leveling algorithms are used to increase the life span of Flash memory storage, by arranging data so that erasures and re-writes are distributed evenly across the SSD.

Garbage collection occurs because NAND flash memory cannot overwrite existing data, the data must first be erased before writing to the same cell [Bel10].

## 2.3 Identity Module Characteristics

Identity modules (commonly known as SIM cards) are synonymous with mobile devices that interoperate  with  GSM  cellular  networks.  Under  the  GSM  framework,  a  mobile  device  is referred to as a Mobile Station and is partitioned into two distinct components: the Universal Integrated  Circuit  Card  (UICC)  and  the  Mobile  Equipment  (ME).  A  UICC,  commonly referred to as an identity module (e.g., Subscriber Identity Module [SIM], Universal Subscriber Identity  Module  [USIM],  CDMA  Subscriber  Identity  Module  [CSIM]),  is  a  removable component that contains  essential  information  about  the  subscriber.  The  ME  and  the  radio handset  portion  cannot  fully  function  without  a  UICC.  The  UICC's  main  purpose  entails authenticating  the  user  of  the  mobile  device  to  the  network  providing  access  to  subscribed services. The UICC also offers storage for personal information, such as phonebook entries, text messages, last numbers dialed (LND) and service-related information.

The UICC partitioning of a mobile device stipulated in the GSM standards has brought about a form  of  portability.  Moving  a  UICC  between  compatible  mobile  devices  automatically transfers the subscriber's identity and some of the associated information (e.g., SMS messages and contacts) and capabilities. In contrast, 2G and 3G CDMA mobile devices generally do not contain a UICC card. Analogous UICC functionality is instead directly incorporated within the device.  However,  newer  CDMA  (i.e.,  4G/LTE)  devices  may  employ  a  CDMA  Subscriber Identity Module (CSIM) application running on a UICC.

A UICC can contain up to three applications: SIM, USIM and CSIM. UICCs used in GSM and UMTS mobile devices use the SIM and UMTS SIM (USIM) applications, while CDMA devices  use the  CSIM  application.  A  UICC  with  all three  applications  provides  users  with additional portability through the removal of the UICC from one mobile device and insertion into another. Because the SIM application was originally synonymous with the physical card itself, the term SIM is often used to refer to the physical card in lieu of UICC. Similarly the terms  USIM  and  CSIM  can  refer  to  both  the  physical  card  as  well  as  the  respective applications supported on the UICC.

At its  core,  a  UICC  is  a  special  type  of  smart  card  that  typically  contains  a  processor  and between 16 to 128 KB of persistent electronically erasable, programmable read only memory (EEPROM). It also includes RAM for program execution and ROM for the operating system, user authentication and data encryption algorithms, and other applications. The UICC's file system  resides  in  persistent  memory  and  stores  data  such  as:  as  phonebook  entries,  text messages,  last  numbers  dialed  (LND)  and  service-related  information.  Depending  on  the mobile device used, some information managed by applications on the UICC may coexist in the memory of the mobile device. Information may also reside entirely in the memory of the mobile device instead of available memory reserved for it in the file system of the UICC.

The UICC operating system controls access to elements of the file system [3GP07]. Actions such  as  reading  or  updating  may  be  permitted  or  denied  unconditionally,  or  allowed conditionally with certain access rights, depending on the application. Rights are assigned to a subscriber through 4-8 digit Personal Identification Number (PIN) codes. PINs protect core subscriber-related data and certain optional data.

A preset number of attempts (usually three) are allowed for providing the correct PIN code to the UICC  before  further  attempts  are  blocked  completely,  rendering  communications inoperative. Only by providing a correct PIN Unblocking Key (PUK) may the value of a PIN and its counter be reset on the UICC. If the number of attempts to enter the correct PUK value exceeds  a  set  limit,  normally  ten,  the  card  becomes  blocked  permanently.  The  PUK  for  a UICC  may  be  obtained  from  the  service  provider  or  network  operator  by  providing  the identifier  of  the  UICC  (i.e.,  Integrated  Circuit  Chip  Identifier  or  ICCID).  The  ICCID  is normally imprinted on the front of UICC, but may also be read from an element of the file system.

UICCs are available in three different size formats. They are: Mini SIM (2FF), Micro SIM (3FF), and Nano SIM (4FF). The Mini SIM with a width of 25 mm, a height of 15 mm, and a thickness of .76 mm, is roughly the footprint of a postage stamp and is currently the most common  format  used  worldwide.  Micro  (12mm  x  15mm  x  .76mm)  and  Nano  (8.8mm  x 12.3mm x .67mm) SIMs are found in newer mobile devices (e.g., iPhone 5 uses the 4FF).

Figure 2: SIM Card Size Formats [Orm09]

<!-- image -->

Though similar in dimension to a miniSD removable memory card, UICCs follow a different set of specifications with vastly different characteristics. For example, their pin connectors are not aligned along the bottom edge as with removable media cards, but instead form a contact pad integral to the smart card chip, which is embedded in a plastic frame, as shown in Figure 2. UICCs also employ a broad range of tamper resistance techniques to protect the information they contain.

The slot for the UICC card is normally not accessible from the exterior of the mobile device to protect insertion and removal as with a memory card. Instead, it typically is found beneath the battery compartment. When a UICC is inserted into a mobile device handset and pin contact is made, a serial interface is used for communicating between them.

In most cases, the UICC should be removed from the handset first and read using a Personal Computer/Smart  Card  (PC/SC)  reader.  Removal  of  the  UICC  provides  the  examiner  with ability to read additional data that may be recovered (e.g., deleted text messages).

Authenticating  a  device  to  a  network  securely  is  a  vital  function  performed  via  the  UICC. Cryptographic key information and algorithms within the tamper resistant module provide the means for the device  to  participate  in  a  challenge-response  dialogue  with  the  network  and respond correctly, without exposing key material and other information that could be used to clone the UICC and gain access to a subscriber's services. Cryptographic key information in the UICC also supports stream cipher encryption to protect against eavesdropping on the air interface.

A UICC is similar to a mobile device as it has both volatile and non-volatile memory that may contain the same general categories of data as found in a mobile device. It can be thought of as a trusted sub-processor that interfaces to a device and draws power from it. The file system resides in the non-volatile memory of a UICC and is organized as a hierarchical tree structure.

For example, the SIM applications file system is composed of three types of elements: the root of the file system (MF), subordinate directory files (DF), and files containing elementary data (EF). Figure 3 illustrates the structure of the file system. The EFs under DF GSM and DFDCS1800 contain mainly network related information for different frequency bands of operation. The EFs under DFTELECOM contain service related information.

MF - Master File (root and main container of DF and EF)

<!-- image -->

EF - Elementary File

Figure 3: SIM File System (GSM)

Various types of digital evidence may exist in elementary data files scattered throughout the file system and be recovered from a UICC. Some of the same information held in the UICC may be maintained in the memory of the mobile device and encountered there as well. Besides the standard files defined in the GSM specifications, a UICC may contain non-standard files established  by  the  network  operator.  Several  general  categories  of  data  may  be  found  in standard elementary data files of a UICC are as follows:

-  Service-related Information including unique identifiers for the UICC, the Integrated Circuit Card Identification (ICCID) and the International Mobile Subscriber Identity (IMSI)
-  Phonebook and call information known respectively as the Abbreviated Dialing Numbers (ADN) and Last Numbers Dialed (LND)
-  Messaging information including both Short Message Service (SMS) text messages and Enhanced Messaging Service (EMS) simple multimedia messages
-  The USIM application supports the storage of links to incoming (EFICI) and outgoing (EFOCI) calls. The EFICI and EFOCI are each stored using two bytes. The first byte

DF - DirectoryFile points to a specific phone book and the second points to an abbreviated dialing number (EFADN) entry 3

-  Location information including Location Area Information (LAI) for voice communications and Routing Area Information (RAI) for data communications.

## 2.4 Cellular Network Characteristics

Within the U.S., different types of digital cellular networks follow distinct incompatible sets of standards.  The  following  sections  discuss  digital  cellular  networks,  Mobile  IP  and  satellite phones.

The  two  most  dominant  types  of  digital  cellular  networks  are  known  as  Code  Division Multiple Access (CDMA) and Global System for Mobile Communications (GSM) networks. Other  common  cellular  networks  include  Time  Division  Multiple  Access  (TDMA)  and Integrated  Digital  Enhanced  Network  (iDEN).  iDEN  networks  use  a  proprietary  protocol designed by Motorola, while the others follow standardized open protocols. A digital version of the original analog standard for cellular telephone phone service, called Digital Advanced Mobile Phone Service (D-AMPS), also exists.

CDMA refers to a technology designed by Qualcomm  in the U.S., which employs spread spectrum communications for the radio link. 4 Rather than sharing a channel as many other network  air  interfaces  do,  CDMA  spreads  the  digitized  data  over  the  entire  bandwidth available, distinguishing multiple calls through a unique sequence code assigned. Successive versions of the IS-95 standard define CDMA conventions in the U.S., which is the reason why the term CDMA is often used to refer to IS-95 compliant cellular networks. IS-95 CDMA systems are sometimes referred to as cdmaOne. The next evolutionary step for CDMA to 3G services was CDMA2000. CDMA2000 is backward compatible with its previous 2G iteration IS-95 (cdmaOne). The successor to CDMA2000 is Qualcomm's Long Term Evolution (LTE). LTE adds faster data transfer capabilities for mobile devices and is commonly referred to as 4G LTE. Verizon and Sprint are common CDMA network carriers in the U.S.

GSM is a cellular system used worldwide that was designed in Europe, primarily by Ericsson and Nokia. AT&amp;T and T-Mobile are common GSM network carriers in the U.S. GSM uses a TDMA air interface. TDMA refers to a digital link technology whereby multiple phones share a single carrier, radio frequency channel by taking turns - using the channel exclusively for an allocated time slice, then releasing it and waiting briefly while other phones use it. A packet switching enhancement to GSM  called General Packet Radio Service  (GPRS)  was standardized to improve the transmission of data. The next generation of GSM, commonly referred to as the third generation or 3G, is known as Universal Mobile Telecommunications System  (UMTS)  and  involves  enhancing  GSM  networks  with  a  Wideband  CDMA  (WCDMA) air interface. 4G LTE is also available to GSM mobile devices providing higher data transmission rates to its customers. 5

3 For more information, visit: http://www.3gpp.org/ftp/Specs/html-info/31102.htm

4 For more information, visit: http://www.qualcomm.com/

5 For more information, visit: http://www.radio-electronics.com

TDMA is also used to refer specifically to the standard covered by IS-136. Using the term TDMA to refer to a general technique or a specific type of cellular network can be a source of confusion.  For  example,  although  GSM  uses  a  TDMA  air  interface  (i.e.,  the  general technique),  as  does  iDEN,  neither  of  those  systems  is  compatible  with  TDMA  cellular networks  that follow IS-136. Many  mobile  forensic tools refer to these devices as iDEN/TDMA phones. Mobile devices operating over the iDEN network often utilize a PushTo-Talk (PTT) function provide subscribers with the ability to communicate with one another over a cellular network in a 'walkie-talkie' fashion.

Integrated  Digital  Enhanced  Network  (iDEN),  a  mobile  telecommunications  technology developed  by  Motorola  provided  the  benefits  of  a  two-way  radio  system  and  a  cellular telephone. The iDEN project originally began as MIRS (Motorola Integrated Radio System) in early 1991 and was phased out the summer of 2013 for the US markets although coverage still exists in Mexico and Canada.

Digital  AMPS (D-AMPS), IS-54 and IS-136 are 2G mobile phone systems once prevalent within the United States and Canada in the 1990s. Existing networks were mostly replaced by GSM/GPRS or CDMA2000 technologies.

Mobile  devices  work  with  certain  subsets  of  the  network  types  mentioned,  typically  those associated  with  a  service  provider  from  whom  the  phone  was  obtained  and  with  whom  a service agreement was entered. Mobile devices may also be acquired without service from any manufacturer, vendor, or other source and subsequently have their service set up separately with  a  service  provider  or  network  operator.  Mobile  devices  that  are  permitted  to  be provisioned to more than one specific carrier are commonly referred to as 'unlocked' as they may be used on a variety of carriers by switching UICC's for GSM mobile devices.

Mobile devices do exist that provide the user with both GSM and CDMA capabilities. Such devices are sometimes referred to as hybrid phones or global phones. These types of mobile devices contain two types of cellular radios for voice and data, providing the ability to operate over either the GSM or CDMA network.

As  the  name  implies,  cellular  networks  provide  coverage  based  on  dividing  up  a  large geographical service area into smaller areas of coverage called cells. Cells play an important role in reuse of radio frequencies in the limited radio spectrum available to allow more calls to occur than otherwise would be possible. As a mobile device moves from one cell to another, a cellular arrangement requires active connections to be monitored and effectively passed along between cells to maintain the connection. To administer the cellular network system, provide subscribed  services,  and  accurately  bill  or  debit  subscriber  accounts,  data  about  the  service contract and associated service activities is captured and maintained by the network system.

Despite  their  differences  in  technology,  cellular  networks  are  organized  similarly  to  one another,  in  a  manner  illustrated  in  Figure  4  [Gib02].  The  main  components  are  the  radio transceiver equipment that communicates with mobile devices, the controller that manages the transceiver  equipment  and  performs  channel  assignment,  and  the  switching  system  for  the cellular  network.  The  technical  names  for  these  components  are  respectively  Node  B, representing a Base Transceiver Station (BTS), the Radio Network Controller (RNC), and the Mobile Switching Center (MSC). The RNCs and the Node B units controlled are sometimes collectively referred to as a Radio Access Network (RAN).

Figure 4: Cellular Network Organization

<!-- image -->

Each  MSC  controls  a  set  of  RNCs  and  manages  overall  communications  throughout  the cellular network, including registration, authentication, location updating, handovers, and call routing. An MSC interfaces with the public switch telephone network (PSTN) via a Gateway MSC (GMSC). To perform its tasks, an MSC uses several databases. A key database is the central  repository  system  for  subscriber  data  and  service  information,  called  the  Home Location Register (HLR). Another database used in conjunction with the HLR is the Visitor Location Register (VLR), which is used for mobile devices roaming outside of their service area. An SGSN (Serving GPRS Support Node) performs a similar role as that of MSC/VLR, but instead supports General Packet Radio Service (GPRS) (i.e., packet-switched services) to the Internet. Likewise, GGSN (Gateway GPRS Support Node) functionality is close to that of a GMSC, but for packet-switched services.

Account information, such as data about the subscriber (e.g., a billing address), the subscribed services, and the location update last registered with the network are maintained at the HLR and used by the MSC to route calls and messages and to generate usage records called Call Detail Records (CDR). The subscriber account data, CDRs, and related technical information obtained from the network carrier are often a valuable source of evidence in an investigation [Con09].

## 2.5 Other Communications Systems

Mobile IP is an Internet Engineering Task Force (IETF) 6 standard communications protocol that  is  designed  to  allow  mobile  device  users  to  move  from  one  network  to  another  while maintaining a permanent IP address. 7 With the original IP protocol, each time a mobile device moved to a new Internet point of attachment, all active network connections had to be restarted and the device possibly needed to be rebooted. Mobile IP instead allows a mobile user to move about transparently while continuing to use the same IP address (the user's "home address"), avoiding these problems and enabling new mobile applications. Mobile IP was designed to support  seamless  and  continuous  Internet  connectivity.  Mobile  IP  is  most  often  found  in wireless environments where users need to carry their mobile devices across multiple Local Area Network (LAN) subnets. Examples of use are in roaming between overlapping wireless systems  e.g.,  Wireless  Local  Area  Network  (WLAN),  Worldwide  Interoperability  for Microwave Access (WiMAX), IP over Digital Video Broadcasting (DVB) and Broadband Wireless Access (BWA). 8

6 For more information, visit: http://www.ietf.org/

Individuals requiring communication services from remote locations (e.g., aviation, emergency services, government, military, etc.) are often equipped with satellite phones. Satellite phones are  mobile  devices  that  establish  connectivity  with  satellites  rather  than  cellular  towers. Typically, satellite phones require a direct line of sight to the satellite without obstruction of objects  (e.g.,  buildings,  trees,  etc.)  impacting  the  signal  strength  and  quality  of  the  call. Depending on the service, coverage may range from a specific area all the way to the entire earth. For example, the Iridium satellite constellation is made up of 66 Low Earth Orbiting (LEO) satellites with spares, providing worldwide voice and data communications.

Figure 5: Satellite Phone Network

<!-- image -->

Satellite phones communicate by sending radio signals to a satellite that transmits a signal back down to earth where a station routes the call to the PSTN. In some cases, the satellite phone provider will transmit from one satellite to another satellite that has a connection to an Earth station. Much like GSM based mobile devices, satellite phones are equipped with a UICC and provide users with a wide variety of features (e.g., contact list, text messaging, voicemail, call forwarding, etc.).

7 For more information, visit http://en.wikipedia.org/wiki/Mobile\_IP

8 For more information, visit http://nislab.bu.edu/sc546/sc441Spring2003/mobileIP

## 3. Forensic Tools

The availability of forensic software tools for mobile devices is considerably different from that of personal computers. While personal computers may differ from mobile devices from a hardware  and  software  perspective,  their  functionality  has  become  increasingly  similar. Although  the  majority  of  mobile  device  operating  systems  are  open  source  (i.e.,  Android), feature  phone  OS's  are  typically  closed.  Closed  operating  systems  make  interpreting  their associated file system and structure difficult. Many mobile devices with the same operating system may also vary widely in their implementation, resulting in a myriad of file system and structure  permutations. These permutations create significant challenges for mobile forensic tool manufacturers and examiners.

The types of software available for mobile device examination include commercial and open source forensic tools, as well as non-forensic tools intended for device management, testing, and diagnostics. Forensic tools are typically designed to acquire data from the internal memory of handsets and UICCs without altering their content and to calculate integrity hashes for the acquired data. Both forensic and non-forensic software tools often use the same protocols and techniques to communicate with a device. However, non-forensic tools may allow unrestricted two-way flow of information and omit data integrity hash functions. Mobile device examiners typically assemble a collection of both forensic and non-forensic tools for their toolkit. The range of devices over which they operate is typically narrowed to: distinct platforms, a specific operating system family or even a single type of hardware architecture. Short product release cycles  are  the  norm  for  mobile  devices,  requiring  tool  manufacturers  to  continually  update their tools providing forensics examiners with an forensic solution. The task is formidable and tool manufacturers' support for newer models may lag significantly behind the introduction of a device into the marketplace. Models of older functioning mobile devices, though out of date, can remain in use for years after their initial release. Mobile device models introduced into one national market may also be used in areas by exchanging the UICC of one cellular carrier with that  from  another  carrier.  The  current  state  is  likely  to  continue,  keeping  the  cost  of examination  significantly  higher  than  if  a  few  standard  operating  systems  and  hardware configurations prevailed.

## 3.1 Mobile Device Tool Classification System

Understanding the various types of mobile acquisition tools and the data they are capable of recovering is important for a mobile forensic examiner. The classification system used in this section provides a framework for forensic examiners to compare the extraction methods used by different tools to acquire data. The objective of the tool classification system is to enable an examiner  to  easily  classify  and  compare  the  extraction  method  of  different  tools.  The  tool classification system is displayed in Figure 6 [Bro08]. As the pyramid is traversed from the bottom, Level 1, to the top, Level 5, the methodologies involved in acquisition become more technical, invasive, time consuming, and expensive.

Level 1, Manual Extraction methods involve recording information brought up on a mobile device  screen  when  employing  the  user  interface.  Level  2,  Logical  Extraction  methods  are used most frequently at this time and are mildly technical, requiring beginner-level training. Methods for levels 3 to 5 entail extracting and recording a copy or image of a physical store (e.g., a memory chip), compared to the logical acquisitions used at level 2 involve capturing a copy of logical storage objects (e.g., directories and files) that reside on a logical store (e.g., a file system partition). Level 3, Hex Dumping/JTAG Extraction methods, entail performing a 'physical acquisition' of mobile device memory in situ and require advanced training. Level 4 Chip-Off methods involve the physical removal of memory from a mobile device to extract data, requiring extensive training in electronic engineering and file system forensics. Level 5, Micro Read methods involve the use of a high-powered microscope to view the physical state of gates. Level 5 methods are the most invasive, sophisticated, technical, expensive, and time consuming of all the methodologies.

There  are  pros  and  cons  to  performing  extraction  types  at  each  layer.  For  example,  hex dumping  allows  deleted  objects  and  any  data  remnants  present  to  be  examined  (e.g.,  in unallocated memory or file system space), which otherwise would be inaccessible through the use  of  logical  acquisition  methods.  However,  the  extracted  device  images  require  parsing, decryption  and  decoding.  Logical  acquisition  methods,  though  more  limited  than  Hex Dumping/JTAG methods, have the advantage in that the system data structures are at a higher level of abstraction and are normally easier for a tool to extract and render. These differences are due to the underlying distinction between memory as seen by a process via the operating system facilities (i.e., a logical view), versus memory as seen in raw form by the processor or another hardware  component  (i.e., a physical view). Based  upon  a  wide  variety of circumstances  (e.g.,  type  of  data  needed,  time  available,  urgency,  available  tools,  etc.),  an examiner may select a specific level to begin their examination. It is important to note that once a level is used, alternate levels may not be possible. For example, after performing chipoff (level 4) lower level tools may not be physically possible. Forensic examiners should be aware of such issues and perform the appropriate level of extraction commensurate with their training  and  experience.  With  each  methodology,  data  may  be  permanently  destroyed  or modified  if  a  given  tool  or  procedure  is  not  proper  utilized.  The  risk  of  alteration  and destruction increases in tandem with the levels. Thus, proper training and mentoring is critical in  obtaining  the  highest  success  rate  for  data  extraction  and  analysis  of  the  data  contained within mobile devices.

Figure 6: Mobile Device Tool Classification System

<!-- image -->

The following discussion provides a more detailed description of each level and the methods used for data extraction.

-  Manual Extraction -A manual extraction method involves viewing the data content stored on a mobile device. The content displayed on the LCD screen requires the manual manipulation of the buttons, keyboard or touchscreen to view the contents of the mobile device. Information discovered may be recorded using an external digital camera. At this level, it is impossible to recover deleted information. Some tools have been developed to provide the forensic examiner with the ability to document and categorize the information recorded more quickly. Nevertheless, if there is a large amount of data to be captured, a manual extraction can be very time consuming and the data on the device may be inadvertently modified, deleted or overwritten as a result of the examination. Manual extractions become increasingly difficult and perhaps unachievable when encountering a broken/missing LCD screen or a damaged/missing keyboard interface. Additional challenges occur when the device is configured to display a language unknown to the investigator; this may cause difficulty in successful menu navigation.
-  Logical Extraction - Connectivity between a mobile device and the forensics workstation is achieved with a connection using either a wired (e.g., USB or RS-232) or wireless (e.g., IrDA, WiFi, or Bluetooth) connection. The examiner should be aware of the issues associated when selecting a specific connectivity method, as different connection types and associated protocols may result in data being modified (e.g., unread SMS) or different amounts or types of data being extracted. Logical extraction tools begin by sending a series of commands over the established interface from the computer to the mobile device. The mobile device responds based upon the command request. The response (mobile device data) is sent back to the workstation and presented to the forensics examiner for reporting purposes.
-  Hex Dumping and JTAG - Hex Dumping and Joint Test Action Group (JTAG) extraction methods afford the forensic examiner more direct access to the raw

information stored in flash memory. One challenge with these extraction methods is the ability of a given tool to parse and decode the captured data. Providing the forensic examiner with a logical view of the file system, and reporting on other data remnants outside the file system that may be present are challenging. For example, all data contained within a given flash memory chip may not be acquired, as many tools, such as flasher boxes, may only be able to extract specific sections of memory [Bre07]. Methods used at this level require connectivity (e.g., cable or WiFi) between the mobile device and the forensic workstation.

Hex Dumping this technique is the more commonly used method by tools at this level. This involves uploading a modified boot loader (or other software) into a protected area of memory (e.g., RAM) on the device. This upload process is accomplished by connecting the mobile device's data port to a flasher box and the flasher box is in turn connected to the forensic workstation.  A series of commands is sent from the flasher box to the mobile device to place it in a diagnostic mode. Once in diagnostic mode,  the flasher box captures all (or sections) of flash memory and sends it to the forensic workstation over the same communications link used for the upload. Some flasher boxes work this way or they may use a proprietary interface for memory extractions. Rare cases exist where extractions can be accomplished using WiFi (i.e., early Jonathan Zdziarski (JZ) Methods) [Zdz12].

JTAG - Many manufacturers support the JTAG standard, which defines a common test interface for processor, memory, and other semiconductor chips. Forensic examiners can communicate with a JTAG-compliant component by utilizing special purpose standalone programmer devices to probe defined test points [Wil05]. The JTAG testing unit can be used to request memory addresses from the JTAGcompliant component and accept the response for storage and rendition [Bre06]. JTAG gives specialists another avenue for imaging devices that are locked or devices that may have minor damage and cannot be properly interfaced otherwise. This method involves attaching a cable (or wiring harness) from a workstation to the mobile device's JTAG interface and access memory via the device's microprocessor to produce an image [Bre07]. JTAG extractions differ mainly from Hex Dumping in that it is invasive as access to the connections frequently require that the examiner dismantle some (or most) of a mobile device to obtain access to establish the wiring connections.

Flasher boxes are small devices originally designed with the intent to service or upgrade mobile devices. Physical acquisitions frequently require the use of a flasher box to facilitate the extraction of data from a mobile device. The flasher box aides the examiner by communicating with the mobile device using diagnostic protocols to communicate with the memory chip. This communication may utilize the mobile device's operating system or may bypass it altogether and communicate directly to the chip [Jon10]. Flasher boxes are often accompanied by software to facilitate the data extraction process working in conjunction with the hardware. Many flasher box software packages provide the added functionality of recovering passwords from mobile device memory as well in some configurations. Although acquisition methods differ between flasher boxes, a general process is used [Bre07]. Limitations of the use of flasher boxes include the following:

-  Rebooting of the mobile device is frequently required to begin the extraction process; this may cause authentication mechanisms to activate preventing further analysis.
-  Many flasher boxes recover the data in an encrypted format requiring the examiner to either use the software provided by the flasher box manufacturer to decrypt the data or may require reverse engineering the data's encryption scheme by the analyst.
-  Many phone models do not provide the acquisition of the entire memory range within a given mobile device. Only certain ranges may be available for certain mobile devices
-  The flasher box service software often has many buttons that are labeled with nearly identical names. This confusion may easily lead even an experienced examiner to press the wrong button, erasing the contents of the mobile device instead of dumping the memory.
-  Lack of documentation on the use of the flasher box tools is common. Extraction methods are frequently shared on forums supported by the vendor and moderated by more seasoned users. Caution should be taken when advice is provided, as not all the information provided is correct.
-  Forensic Use: Nearly all flasher boxes were not designed with a forensic use as its intended purpose. Examiners must be experienced in the use of flasher boxes and should understand the proper use and function of flasher boxes.
-  Despite all of these limitations, use of a flasher box is a viable option for many forensics cases. Proper training, experience and understating of how the tools work are the keys to success.

A wide range of technical expertise and proper training is required for extracting and analyzing binary images with these methods, including locating and connecting to JTAG ports, creating customized boot loaders and recreating file systems.

-  Chip-Off - Chip-Off methods refer to the acquisition of data directly from a mobile device's flash memory. This extraction requires the physical removal of flash memory. Chip-Off provides examiners with the ability to create a binary image of the removed chip. In order to provide the examiner with data in a contiguous binary format file, the wear-leveling algorithm must be reverse engineered. Once complete, the binary image may then be analyzed. This type of acquisition is most closely related to physical imaging a hard disk drive as in traditional digital forensics. Extensive training is required in order to successfully perform extractions at this level. Chip-Off extractions are challenging based on a wide variety of chip types, a myriad of raw data formats, and the risk of causing physical damage to the chip during the extraction process. Due to the complexities related to Chip-Off, JTAG extraction is more common.
-  Micro Read - A Micro Read involves recording the physical observation of the gates on a NAND or NOR chip with the use of an electron microscope. Due to the extreme technicalities involved when performing a Micro Read, this level of acquisition would

only be attempted for high profile cases equivalent to a national security crisis after all other acquisition techniques have been exhausted. Successful acquisition at this level would require a team of experts, proper equipment, time and in-depth knowledge of proprietary information. There are no known U.S. Law Enforcement agencies performing acquisitions at this level. Currently, there are no commercially available Micro Read tools.

Table 3 provides a classification of some tools currently used in mobile device investigations, and  identifies  the  facilities  they  provide:  acquisition,  examination,  or  reporting.  Additional tools do exist, but only those familiar to the authors are discussed. For a more complete an up to date list of forensic tools refer to: NIST Tool Taxonomy (http://www.cftt.nist.gov/tool\_catalog/populated\_taxonomy/).  The  tools  listed  in  Table  3  are grouped by level starting with Level 1 (Manual Extraction) through Level 4 (Chip-Off).

The following describes each of the headings contained within Table 3:

-  Tool - tool name
-  † Denotes a tool that supports the logical acquisition of a UICC
-  ‡ Denotes a tool that supports the logical acquisition of a UICC and the creation of a Cellular Network Isolation Card (CNIC)
-  Acquisition Level - level(s) at which the tool performs data extractions: 1- Manual extraction, 2 - Logical extraction, 3 - Physical extraction, 4 - Chip-off, 5 - Micro Read
-  Network Type - acquisition of devices operating over specified networks
-  Forensic Tool - is the tool specifically designed for forensic acquisition
-  Examination/Analysis - provides the examiner with the ability to perform examination or analysis of acquired data
-  Reporting - provides the examiner with the ability to generate reports
-  3rd Party Tool Image Analysis (3PIA) - supports importing of raw data produced from another manufacturer's tool
-  Chinese Chipset Support (CCS) - mobile devices containing Chinese chipsets are increasing as they continue to flood the international market. Some mobile forensic tools provide either a logical and/or physical extraction solution.
-  Cables/Hardware Available (C/HW) - cables are provided

Table 3: Mobile Device Forensic Tools

|                                 | Level       | Network Type   | Network Type   | Network Type   | Forensic Tool   | Exam/Analysis   | Reports   |            |                                                                                           |
|---------------------------------|-------------|----------------|----------------|----------------|-----------------|-----------------|-----------|------------|-------------------------------------------------------------------------------------------|
| Tool                            | Acquisition | GSM            | CDMA           | iDEN/TDMA      |                 |                 |           | MISC       |                                                                                           |
| ART                             | 1           |              |              |              |                | N/A             |          | N/A        | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| Eclipse                         | 1           |              |              |              |                | N/A             |          | N/A        | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| Project-A-Phone                 | 1           |              |              |              |                | N/A             |          | N/A        | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| STE3000 FAV                     | 1           |              |              |              |                | N/A             |          | N/A        | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| ZRT2                            | 1           |              |              |              |                | N/A             |          | N/A        | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| Aceso †                         | 2           |              |              |              |                |                |          | C/HW       | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| Athena †                        | 2           |              |              |              |                |                |          | C/HW       | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| BitPIM                          | 2           |              |              |              |  9             |                |          |           | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| CPA SIM Analyzer 10 ‡           | 2           |              |              |              |                |                |          | C/HW       | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| FinalMobile Forensics           | 2           |              |              |              |                |                |          | 3PIA       | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| iXAM 9                          | 2           |              |              |              |                |                |          | N/A        | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| BlackLight                      | 2           |              |              |              |               |               |         | 3PIA       | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| MOBILedit! Forensic ‡           | 2           |              |              |              |                |                |          | C/HW       | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| Oxygen Forensic Suite (Analyst) | 2           |              |              |              |                |                |          | CCS        | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| SDiPhone Recovery 12            | 2           |              |              |              |                |                |          | N/A        | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| SecureView †                    | 2           |              |              |              |                |                |          | 3PIA, C/HW | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| SIMIS †                         | 2           |              |              |              |                |                |          | C/HW       | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |

|                              | Acquisition Level   | Network Type   | Network Type   | Network Type   | Forensic Tool   | Exam/Analysis   | Reports   |                 |                                                                                           |
|------------------------------|---------------------|----------------|----------------|----------------|-----------------|-----------------|-----------|-----------------|-------------------------------------------------------------------------------------------|
| Tool                         |                     | GSM            | CDMA           | iDEN/TDMA      |                 |                 |           | MISC            |                                                                                           |
| SIMCon †                     | 2                   |              |              |              |               |               |         | C/HW            | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| SIMiFOR ‡                    | 2                   |              |              |              |                |                |          | C/HW            | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| UFED Classic Logical ‡       | 2                   |              |              |              |                |                |          | C/HW            | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| UFED Touch Logical ‡         | 2                   |              |              |              |                |                |          | C/HW            | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| USIM Detective †             | 2                   |              |              |              |                |                |          | C/HW            | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| WinMoFo                      | 2                   |              |              |              |                |                |          |                | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| XRYLogical ‡                 | 2                   |              |              |              |                |                |          | C/HW            | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| Zdziarski Method 11          | 2                   |              |              |              |                |                |          | N/A             | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| CellXtract †                 | 2/3                 |              |              |              |                |                |          | C/HW            | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| CellXtract TNT †             | 2/3                 |              |              |              |                |                |          | CCS, C/HW       | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| Device Seizure ‡             | 2/3                 |              |              |               |                |                |          | 3PIA, C/HW      | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| EnCase Smartphone Examiner † | 2/3                 |              |              |               |                |                |          | 3PIA, C/HW      | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| Lantern                      | 2/3                 |              |              |               |                |                |          | 3PIA            | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| MPE+ ‡                       | 2/3                 |              |              |               |                |                |          | 3PIA, CCS, C/HW | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| Tarantula                    | 2/3                 |              |              |               |                |                |          | CCS, C/HW       | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| UFED Classic Ultimate ‡      | 2/3                 |              |              |              |                |                |          | 3PIA, CCS, C/HW | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| UFED Touch Ultimate ‡        | 2/3                 |              |              |               |                |                |          | 3PIA, CCS, C/HW | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |
| XRYComplete ‡                | 2/3                 |              |              |               |                |                |          | CCS, C/HW       | Current tool list available at: http://www.cftt.nist.gov/tool_catalog/populated_taxonomy/ |

|                              | Level       | Network Type   | Network Type   | Forensic Tool   | Exam/Analysis   | Reports   |        |
|------------------------------|-------------|----------------|----------------|-----------------|-----------------|-----------|--------|
| Tool                         | Acquisition | GSM            | CDMA           |                 |                 |           | MISC   |
| CDMAWorkshop                 | 3           |              |              |                |                |          |      |
| Cell Phone Analyzer 12 †     | 3           |              |              |                |                |          | 3PIA   |
| BeeProg2                     | 4           |                |              |                |                |          |       |
| FlashPAK III                 | 4           |                |              |                |                |          |       |
| NFI Memory Toolkit           | 4           |                |              |                |                |          |      |
| PC3000 Flash                 | 4           |                |              |                |                |          | C/HW  |
| SDFlashDoctor                | 4           |                |              |                |                |          | C/HW   |
| Soft-Center NANDFlash Reader | 4           |                |              |                |                |          |       |
| UP-828                       | 4           |                |              |               |               |         |      |

† Denotes a tool that supports the logical acquisition of a UICC

‡ Denotes a tool that supports the logical acquisition of a UICC and the creation of a CNIC

MISC : 3 rd Party Tool Image Analysis (3PIA), Chinese Chipset Support (CCS), Cables/Hardware Available (C/HW)

## 3.2 UICC Tools

A few mobile forensics tools deal exclusively with UICCs. These tools perform a direct read of a UICC's contents via a Personal Computer/Smart Card (PC/SC) reader, as opposed to an indirect read via the mobile device. The richness and scope of data acquired varies with the capabilities  and  features  of  the  tool.  The  majority  of  UICC  exclusive  tools  acquire  the following data:  International  Mobile  Subscriber  Identity  (IMSI),  Integrated  Circuit  Card  ID (ICCID), Abbreviated Dialing Numbers (ADN), Last Numbers Dialed (LND), SMS messages, and Location Information (LOCI) [Aye12].

Most tools provide additional information such as deleted SMS messages, properly rendered foreign language SMS and EMS messages. They also attempt to translate certain data such as country and network operator codes into meaningful names, and provide other facilities such as PIN administration.

CSIM partitions on UICCs are being used with increasing frequency for LTE enabled mobile devices. At this time, few tools support the extraction of CSIM partition data as most only support extraction of GSM and USIM partitions. CSIM data may prove to be of increasing forensic importance as this technology evolves.

12 This tool only performs data analysis.

## 3.3 Obstructed Devices

The following sections discuss techniques for bypassing an obstructed device i.e., a mobile device that requires successful authentication using a password or some other means to obtain access to the device. A number of ways exist to recover data from obstructed devices. These methods fall into one of three categories: software-based, hardware-based and investigative. Common  obstructed  devices  include  those  with  missing  identity  modules,  PIN-enabled UICCs,  or  an  enabled  mobile  device  lock.  Password  locked  and  encrypted  memory  cards provide a user with additional means to protect data. This protection may make recovery of such data more complex. Content encryption capabilities are offered as a standard feature in many  mobile  devices  or  may  be  available  through  add-on  applications.  Software  and hardware-based methods are often directed at a particular device or narrow class of device.

As  mobile  forensics  tools  have  evolved,  they  have  begun  to  provide  automated  functions allowing  examiners  to  bypass  many  security  mechanisms  as  a  part  of  their  products.  For instance, some tools provide an automated function to recover passwords from locked mobile devices.  In  developing  a  method,  the  following  sections  provide  actions  that  should  be considered for determining possible approaches.

## 3.3.1 Software and Hardware Based Methods

Software-based methods used to break or bypass authentication mechanisms have begun to appear. For instance, some tools provide an automated function to recover passwords from locked mobile devices. This type of functionality varies greatly between mobile forensic tools and the devices models that are supported.

Hardware-based methods involve a combination of software and hardware to break or bypass authentication mechanisms and gain access to the device. For example, the value of a mobile device lock can be readily recovered from a memory dump of certain devices, allowing for a follow-on logical acquisition. JTAG and flasher boxes are often used this way to circumvent authentication mechanisms. Device-specific attacks, such as cold boot attacks, exist to bypass authentication  mechanisms.  Cold  boot  attacks  have  the  ability  to  recover  passwords  from locked Android based devices by cooling the device 10 degrees below Celsius followed by disconnecting and reconnecting the battery in 500ms intervals [Mül12].

Few  general-purpose  hardware-based  methods  apply  to  a  general  class  of  mobile  devices. Most of the techniques are tailored for a specific model within a class.

## 3.3.2 Investigative Methods

Investigative  methods  are  procedures  the  investigative  team  can  apply,  which  require  no forensic software or hardware tools. The most obvious methods are the following:

-  Ask the owner - If a device is protected with a password, PIN or other authentication mechanism involving knowledge-based authentication, the owner may be queried for this information during an interview.

-  Review seized material - Passwords or PINs may be written down on a slip of paper and kept with or near the phone, at a desktop computer used to synchronize with the mobile device, or with the owner, such as in a wallet, and may be recovered through visual inspection. Packaging material for a UICC or a mobile device may disclose a PIN Unlocking Key (PUK) that may be used to reset the value of the PIN. Device specific vulnerabilities may also be exploited, such as Smudge attacks. Smudge attacks involved careful analysis of the surface of a touch screen device to determine the most recent gesture lock used [Avi10].
-  Ask the service provider - If a GSM mobile device is protected with a PIN-enabled UICC, the identifier (i.e., the ICCID) may be obtained from it and used to request the PUK from the service provider and reset the PIN. Some service providers offer the ability to retrieve the PUK online, by entering the telephone number of the mobile device and specific subscriber information into public web pages set up for this purpose. Additionally, information may be obtained by contacting the device manufacturer (e.g., Apple).

Mobile device users may choose weak passwords to secure their device such as: 1-1-1-1, 0-00-0 or 1-2-3-4. Some of these numeric combinations are device default passcodes provided by the  manufacturer.  It  is  not  recommended  to  attempt  to  unlock  a  device  using  these combinations  due  to  several  risk  factors.  They  may  include  permanent  wiping  of  mobile device  memory,  enabling  additional  security  mechanisms  (e.g.,  PIN/PUK)  or  initializing destructive applications. Mobile devices generally have a defined number of attempts before enabling  further  security  precautions.  Before  making  any  attempts  at  unlocking  a  mobile device, it is recommended to consider the number of attempts left. There may be an instance where an examiner may choose to accept these risks in cases where this is the only option for data extraction.

## 3.4 Forensic Tool Capabilities

Forensic software tools strive to handle conventional investigative needs by addressing a wide range of applicable devices. More difficult situations, such as the recovery of deleted data from the memory of a device, may require more specialized tools and expertise and disassembly of the device. The range of support provided, including mobile device cables and drivers, product documentation, PC/SC readers, and the frequency of updates, may vary significantly among products. The features offered such as searching, bookmarking, and reporting capabilities may also vary considerably.

Discrepancies in recovering and reporting the data residing on a device have been noted in previous testing of tools. They include the inability to recover resident data, inconsistencies between the data displayed on workstation and that generated in output reports, truncated data in reported or displayed output, errors in the decoding and translation of recovered data, and the inability to recover all relevant data. On occasion, updates or new versions of a tool were also found to be less capable in some aspects than a previous version was [Aye11, Jan09].

Tools should be validated to ensure their  acceptability and  reapplied  when updates  or  new versions of the tool become  available. These  results play a factor in deciding the appropriateness of the tool, how to compensate for any noted shortcomings, and whether to consider using a different version or update of the tool. Validating a tool entails defining and identifying a comprehensive set of test data, following acquisition procedures to recover the test data, and assessing the results [Aye11, Jan09]. Present-day tools seldom provide the means to obtain detailed logs of data extraction and other transactions that would aid in validation. An examiner can compare the output of several tools to verify the consistency of results. While tool validation is time consuming, it is a necessary practice to follow. As a quality measure, forensic specialists should also receive adequate up-to-date training in the tools and procedures they employ.

An  important  characteristic  of  a  forensic  tool  is  its  ability  to  maintain  the  integrity  of  the original data source being acquired and also that of the extracted data. The former is done by blocking or otherwise eliminating write requests to the device containing the data. The latter is done by computing a cryptographic hash over the contents of the evidence files created and recurrently verifying that this value remains unchanged throughout the lifetime of those files. Preserving integrity not only maintains credibility from a legal perspective, but it also allows any subsequent investigation to use the same baseline for replicating the analysis.

Forensic Hash Validation: A forensic hash is used to maintain the integrity of an acquisition by computing  a  cryptographically  strong,  non-reversible  value  over  the  acquired  data.  After acquisition, any changes made to the data may be detected, since a new hash value computed over the data will be inconsistent with the old value. For non-forensic tools, hash values should be created using a tool such as sha1sum and retained for integrity verification. Even tools labeled as forensic tools may not compute a cryptographic hash, and in these cases an integrity hash should be computed separately.

Note that mobile devices are constantly active and update information (e.g., the device clock) continuously.  Therefore,  back-to-back  acquisitions  of  a  device  will  be  slightly  different  and produce different hash values when computed over all the data. However, hash values computed over  selected  data  items,  such  as  individual  files  and  directories,  generally  remain  consistent. Hash  inconsistencies  may  occur  requiring  the  examiner  to  perform  an  element-by-element verification  ensuring  data  integrity.  Hash  validation  across  multiple  tools  is  challenging  due  to proprietary reporting formats.

## 4. Preservation

Sections 4 through 7 describe the forensics process as it applies to mobile devices. Evidence preservation  is  the  process  of  securely  maintaining  custody  of  property  without  altering  or changing the contents of data that reside on devices and removable media. It is the first step in digital evidence recovery. The chapter begins with a generic introduction to preservation, and then provides more specific guidance about how to deal with mobile devices.

Preservation  involves  the  search,  recognition,  documentation,  and  collection  of  electronicbased  evidence.  In  order  to  use  evidence  successfully,  whether  in  a  court  of  law  or  a  less formal proceeding, it must be preserved. Failure to preserve evidence in its original state could jeopardize an entire investigation, potentially losing valuable case-related information.

The remaining  sections  of  this  chapter  provide  supplemental  information  related  to  mobile devices,  following  the  paradigm  of  Securing  and  Evaluating  the  Scene,  Documenting  the Scene, Isolation, Packaging, Transporting, and Storing Evidence, and Triage/On-Site Processing.

## 4.1 Securing and Evaluating the Scene

Incorrect procedures or improper handling of a mobile device during seizure may cause loss of digital data. Moreover, traditional forensic measures, such as fingerprints or DNA testing, may need to be applied to establish a link between a mobile device and its owner or user. If the device is not handled properly, physical evidence may be contaminated and rendered useless.

Alertness to mobile device characteristics and issues (e.g., memory volatility) and familiarity with tangential equipment (e.g., media, cables, and power adapters) are essential. For mobile devices,  sources  of  evidence  include  the  device,  UICC  and  associated  media.  Associated peripherals, cables, power adapters, and other accessories are also of interest. All areas of the scene should be searched thoroughly ensuring related evidence is not overlooked.

Equipment associated with the mobile device, such as removable media, UICCs, or personal computers, may prove more valuable than the mobile device itself. Removable media varies in size and can be easily hidden and difficult to find. Most often, removable memory cards are identifiable by their distinctive shape and the presence of electrical contacts located on their bodies  that  are  used  to  establish  an  interface  with  the  device.  Personal  computers  may  be particularly  useful  in  later  accessing  a  locked  mobile  device,  if  the  personal  computer  has established a trusted relationship with it. For example, Apple incorporates a pairing process whereby an existing pairing record file can be used by some tools [Zdz12] to access the mobile device while it is still locked.

When interviewing the owner or user of a mobile device, consider requesting any security codes, passwords or gestures needed to gain access to its contents. For example, GSM devices may have authentication codes set for the internal memory and/or the UICC.

While securing a mobile device, caution should be taken when an individual is  allowed to handle the mobile device. Many mobile devices have master reset codes that clear the contents of the device to original factory conditions. Master resets may be performed remotely requiring proper  precautions  such  as  network  isolation  to  ensure  that  evidence  is  not  modified  or destroyed.

Mobile devices may be found in a compromised state that may complicate seizure, such as immersion in a liquid. In these situations, forensic examiners should adhere to agency specific procedures. One method involves removal of the battery preventing electrical shorting, while the remainder of the mobile device is sealed in an appropriate container filled with the same liquid for transport to the lab, provided the liquid is not caustic. Some compromised states, such as blood contamination or use with explosives (i.e., as a bomb component) can pose a danger to the technician collecting evidence. In such situations, a specialist should be consulted for specific instructions or assistance.

Mobile devices and associated media may be found in a damaged state, caused by accidental or deliberate action. Devices or media with visible external damage do not necessarily prevent the  extraction  of  data.  Damaged  equipment  should  be  taken  back  to  the  lab  for  closer inspection.  Repairing  damaged  components on a mobile  device and restoring the device to working order for examination and analysis may be possible.

Undamaged  memory components may also be removed  from  a  damaged  device  and  their contents  recovered  independently.  This  method  should  be  used  with  caution,  as  it  is  not possible with all devices.

## 4.2 Documenting the Scene

Evidence must be accurately identified and accounted for. Non-electronic materials such as invoices,  manuals,  and  packaging  material  may  provide  useful  information  about  the capabilities of the device, the network used, account information, and unlocking codes for the PIN. Photographing the crime scene in conjunction with documenting a report on the state of each  digital  device  and  all  computers  encountered  may  be  helpful  in  the  investigation,  if questions arise later about the environment.

A record of all visible data should be created. All digital devices, including mobile devices, which  may  store  data,  should  be  photographed  along  with  all  peripherals  cables,  power connectors, removable media, and connections. Avoid touching or contaminating the mobile device when photographing it and the environment where found. If the device's display is in a viewable  state,  the  screen's  contents  should  be  photographed  and,  if  necessary,  recorded manually, capturing the time, service status, battery level, and other displayed icons.

## 4.3 Isolation

Many mobile devices offer the user with the ability to perform either a remote lock or remote wipe by simply sending a command (e.g., text message) to the mobile device.

Additional reasons for disabling network connectivity include incoming data (e.g., calls or text messages) that may modify the current state of the data stored on the mobile device. Outgoing data may also be undesirable as the current GPS location may be delivered to an advisory providing the geographic location of the forensic examiner.

Therefore, forensic examiners need to be aware and take precautions when securing mobile devices mitigating the chance of data modification. The Scientific Working Group on Digital Evidence's  (SWGDE)  'Best  Practices  for  Mobile  Phone  Forensics'  document  covers  best practice for the proper isolation of mobile devices [SWG13]. Some key implications for proper collection are summarized below.

Isolating the mobile device from other devices used for data synchronization is important to keep new data from contaminating existing data. If the device is found in a cradle or connected with a personal computer, pulling the plug from the back of the personal computer eliminates data transfer or synchronization overwrites. It is recommended that a capture of the personal computer's  memory  be  extracted  before  'pulling  the  plug'  as  memory  acquired  generally proves to be of significant forensic value. Caution should be used, as removing a device that if performing a software update or backup has the potential to corrupt the mobile device's file system. The use of memory forensics tools for the capture of a personal computer's memory should  be  done  by  a  qualified  digital  forensics  professional.  The  mobile  device  should  be seized along with associated hardware. Media cards, UICCs, and other hardware residing in the mobile device should not be removed. Also, seizing the computer that was connected to the mobile device provides the ability to acquire synchronized data from the hard disk that might not be obtained from the device. Any associated hardware such as media cards, UICCs, power adapters, device sleeves, or peripherals, should be seized along with related materials such as product manuals, packaging, and software.

Isolating  a  mobile  device  from  all  radio  networks  (e.g.  WiFi,  Cellular  and  Bluetooth)  is important to keep new traffic, such as SMS messages, from overwriting existing data. Besides the risk of overwriting potential evidence, the question may arise whether data received on the mobile device after seizure is within the scope of the original authority granted. Vulnerabilities may  exist  that  may  exploit  a  weaknesses  related  to  software  vulnerabilities  from  the  web browser and OS, SMS, MMS, third-party applications and WiFi networks. The possibility of such  vulnerabilities  being  exploited  may  permit  the  argument  that  data  may  have  been modified during the forensic examination.

Three basic methods for isolating the mobile device from radio communication and preventing these problems are to either: place the device in airplane mode, turn the device off, or lastly place the device in a shielded container. Each method has certain drawbacks.

-  Enabling 'Airplane Mode' requires interaction with the mobile device using the keypad, which poses some risk - less so, if the technician is familiar with the device in question and documents the actions taken (e.g., on paper or on video). Note: airplane mode does not prevent the system from using other services such as GPS in all cases.
-  Turning off the mobile device may activate authentication codes (e.g., UICC PIN and/or handset security codes), which are then required to gain access to the device, complicating acquisition and delaying examination.
-  Keeping the mobile device on, but radio isolated, shortens battery life due to increased power consumption as devices unable to connect to a network raise their signal strength to maximum. After some period, failure to connect to the network may cause certain mobile devices to reset or clear network data that otherwise would be useful if recovered [Smi05]. Faraday containers may attenuate the radio signal, but not necessarily eliminate it completely, allowing the possibility of communications being established with a cell tower, if in its immediate vicinity. The risk of improperly sealing the Faraday container (e.g., bag improperly sealed, exposed cables connected to the forensic workstation may act as an antenna) and unknowingly allowing access to the cell network also exists.

To conserve  power,  some  mobile  devices  are  normally  configured  to  enter  energy  savings mode  and  shut  off  the  display  after  a  short  period  of  inactivity.  Some  devices  also  shut themselves off if the battery level drops below a certain threshold to protect data stored in volatile memory, which defeats the original purpose of keeping it turned on. Keeping such a device  in  the  active  state  is  troublesome,  requiring  periodic  interaction  with  the  device.  If additional power cannot be supplied to a device and it is turned off to conserve power and preserve memory contents, the risk of encountering a protection mechanism when turned on again is likely. Moreover, authentication mechanisms, such as passwords, typically cannot be deactivated without first satisfying the mechanism (e.g., supplying the correct password).

The time maintained on the mobile device may be set independently of that from the network. Always record the date and time shown on the handset, if it is turned on, and compare them with  a  reference  clock,  noting  any  inconsistencies.  If  the  screen  is  dim  due  to  power management, it may be necessary to press an 'insignificant' key, such as the volume key, to light the screen.

Security  mechanisms,  key  remapping  and  malicious  programs  may  be  present  on  mobile devices. Certain types of modifications to the software applications and operating system of the  device  might  affect  the way  it  is  handled. The  following  is  a  list  of  examples of  some classes of modifications to consider:

-  Security Enhancements - Organizations and individuals may enhance their handheld devices with add-on security mechanisms. A variety of login, biometric, and other authentication mechanisms are available for mobile devices may be as replacements or supplements to password mechanisms. Improper interaction with a mechanism could cause the device to lock down and even destroy its contents. This is particularly a concern with mechanisms that use security tokens whose presence is constantly monitored and whose disconnection from a card slot or other device interface is immediately acted upon.
-  Malicious Programs - A mobile device may contain a virus or other malicious software. Such malware 13 may attempt to spread to other devices over wired or wireless interfaces, including cross-platform jumps to completely different platforms. Common utilities or functions may also be intentionally replaced with versions of software designed to alter or damage data present on a mobile device. Such programs could conditionally be activated or suppressed based on conditions such as input parameters or hardware key interrupts. Watchdog applications could also be written to listen for specific events (e.g., key chords or over the air messages) and carry out actions such as deleting the contents of the device.
-  Key Remapping - Hardware keys may be remapped to perform a different function than the default. A key press or combination of key presses intended for one purpose could launch an arbitrary program.
-  Geo Fencing - Some devices may be configured to automatically wipe all data when the GPS in the device determines that it has left (or entered) a specific predetermined geographic area. This method may also employ WiFi towers for location determination as well.

13 For  more  information,  visit:  http://appleinsider.com/articles/13/05/14/mobile-malware-exploding-but-only-forandroid

-  Explosives and Booby Traps - Mobile devices may be rigged to detonate bombs remotely or explode themselves if a specific action is carried out on the device (e.g., receiving an incoming call, text message or pressing a specific key chord sequence, etc.). 14
-  Alarms - Many mobile devices have an audible alarm feature. The alarm function is capable of powering on an inactive device, establishing network connectivity and the potential for a remote wipe.

The following sections 4.3.1 through 4.3.3 discuss the use and characteristics of radio isolation containers and cellular network isolation techniques.

## 4.3.1 Radio Isolation Containers

A field test on the effectiveness of various mobile phone shielding devices (i.e., a tool designed to  act  as  a  Faraday  cage)  was  conducted  at  Purdue  University.  There  are  many  shielding devices  that  claim  to  radio  isolate  a  mobile  device  unfortunately  these  tools  do  not  always successfully  prevent  network  communication  [Kat10].  The  tests  conducted  at  Purdue  used multiple  shielding  devices  with  mobile  devices  operating  over  three  of  the  largest  U.S. providers while varying the distance from the provider's towers.

The majority of the test cases proved that the shielding devices tested did not prevent network communication  in  all  cases,  and  SMS  messages  most  often  penetrated  the  device  while shielded,  followed  by  voice  calls  and  MMS  messages.  Three  reasons  why  the  shielding devices may fail are due to: the materials not providing enough attenuation, leaks or seams in the shield or the conductive shield acting as an antenna.

While many manufacturers claim the effectiveness of their shielding device it is important to understand the effectiveness of the isolation device is based upon attenuating signal between specific decibels. Therefore, the effectiveness of the isolation containers tested were not 100% effective in most cases and devices used to preserve evidence require verification.

Some of the products mentioned in the above paper have since been improved to provide a more effective radio isolation solution. Examiners should test their own products to validate that they are working properly before use.

## 4.3.2 Cellular Network Isolation Techniques

A number of techniques exist for isolating a mobile device from cell tower communications [INT06]. The device should be fully charged prior to examination and consideration should be given to having a fixed or portable power source attached. The following provides an overview of various cellular network isolation techniques.

-  Cellular Network Isolation Card (CNIC) - A CNIC mimics the identity of the original UICC and prevents network access to/from the handset. Such cards prevent the handset from erasing call log data due to a foreign SIM being inserted. This technique permits acquisition without concern of wireless interference.

14 For more information, visit: http://www.scientificamerican.com/article.cfm?id=boston-marathon-bomb-attack

---

<!-- RAG_IGNORE_START -->
> **DERECHOS DE AUTOR Y LICENCIA MIT**
>
> Este archivo de texto estructurado ha sido generado y optimizado automáticamente para su consumo por sistemas de Inteligencia Artificial (RAG).
> 
> * **Creador:** Jull Ortiz (Arquitecto de Información IA y bases de datos vectoriales)
> * **Propósito:** Avanzar en la transformación tecnológica del sistema de justicia venezolano.
> * **Licencia:** MIT License
> * **Copyright (c) 2026 Jull Ortiz**
>
> Se concede permiso por la presente, sin cargo, a cualquier persona que obtenga una copia de este software y de los archivos de documentación asociados, para utilizarlo sin restricciones, incluyendo el derecho a usar, copiar, modificar, fusionar y publicar. El aviso de copyright anterior y este aviso de permiso se incluirán en todas las copias o partes sustanciales del archivo.
<!-- RAG_IGNORE_END -->
