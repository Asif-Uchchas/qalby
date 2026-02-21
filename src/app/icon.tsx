import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Qalby Logo';
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '25%',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
            >
                {/* Simplified Geometric Islamic Shape */}
                <div
                    style={{
                        width: '20px',
                        height: '20px',
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        clipPath: 'polygon(50% 0%, 63% 38%, 100% 38%, 69% 59%, 82% 100%, 50% 75%, 18% 100%, 31% 59%, 0% 38%, 37% 38%)',
                        display: 'flex',
                    }}
                />
                {/* Inner glow dot */}
                <div
                    style={{
                        position: 'absolute',
                        width: '4px',
                        height: '4px',
                        background: 'white',
                        borderRadius: '50%',
                        opacity: 0.5,
                    }}
                />
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}
