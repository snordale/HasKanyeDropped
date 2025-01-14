import Image from 'next/image';

export default function Header({ theme }) {
  return (
    <div className='fluid-container d-flex justify-content-between align-items-center bg-white pt-4 pb-2'
         style={{ position: 'sticky', top: 0, zIndex: 99999, boxShadow: '0px 20px 12px rgb(255 255 255)' }}>
      <div className='d-flex align-items-center'>
        <Image
          src="/favicons/favicon-16x16.png"
          width={60}
          height={60}
          alt="Logo"
          style={{
            borderRadius: '6px',
            imageRendering: 'pixelated',
          }}
        />
        <h4 className='pl-3 font-weight-bold m-0' style={{ paddingTop: '1px', color: theme.color }}>
          Has Kanye Dropped?
        </h4>
      </div>
      <a href='https://theivyplatform.com' target='_blank' rel="noopener noreferrer">
        <Image src='/images/ivy_logo.png' width={32} height={32} alt="Ivy Platform Logo" />
      </a>
    </div>
  );
} 