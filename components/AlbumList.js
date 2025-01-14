import Image from 'next/image';

export default function AlbumList({ albums }) {
  return (
    <div className='d-flex flex-column'>
      {albums.order.map((albumName) => {
        const album = albums.data[albumName];
        const releaseDate = new Date(album.releaseDate);

        return (
          <div key={albumName} className='d-flex row justify-content-center py-4'>
            <a className="hover-link" href={album.uri}>
              <div className='d-flex flex-column align-items-center p-4 rounded'>
                <Image
                  src={album.imageUrl}
                  width={200}
                  height={200}
                  alt={album.name}
                  style={{ borderRadius: '12px' }}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
                  onError={(e) => {
                    e.target.src = '/error.jpg'
                  }}
                />
                <div className='d-inline text-center text-break pt-3 small font-weight-bold'>
                  {album.name}
                </div>
                <div className='d-inline pt-1 small font-weight-bold text-truncate'>
                  {releaseDate.toLocaleDateString()}
                </div>
              </div>
            </a>
          </div>
        );
      })}
    </div>
  );
} 