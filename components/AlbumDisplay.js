import Image from 'next/image';

export default function AlbumDisplay({ album, hasNewAlbum, imageUrl }) {
  return (
    <div className='d-flex justify-content-center overflow-hidden bg-secondary my-2'
         style={{
           position: 'relative',
           width: 120,
           height: 120,
           borderRadius: 60,
           border: '2px solid',
           borderColor: hasNewAlbum ? '#00cc2f' : '#ff0015'
         }}>
      <Image
        src={hasNewAlbum ? album?.imageUrl : imageUrl}
        width={120}
        height={120}
        alt="Album Cover"
        style={{ objectFit: 'cover' }}
      />
      <div className="position-absolute d-flex justify-content-center align-items-center"
           style={{ width: '100%', height: '100%', opacity: 0.5, top: 0, backgroundColor: 'black' }} />
      <div style={{
        color: hasNewAlbum ? '#00cc2f' : '#ff0015',
        position: 'absolute',
        top: 40
      }} className='h2 m-0'>
        {hasNewAlbum ? 'Yes' : 'No'}
      </div>
    </div>
  );
} 