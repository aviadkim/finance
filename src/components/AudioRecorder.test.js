import { render, screen, fireEvent, act } from '@testing-library/react';
import AudioRecorder from './AudioRecorder';

describe('AudioRecorder', () => {
  beforeEach(() => {
    // Mock getUserMedia
    global.navigator.mediaDevices = {
      getUserMedia: jest.fn().mockResolvedValue(new MediaStream())
    };

    // Mock MediaRecorder
    global.MediaRecorder = jest.fn().mockImplementation(() => ({
      start: jest.fn(),
      stop: jest.fn(),
      ondataavailable: jest.fn(),
      onstop: jest.fn()
    }));
  });

  test('renders recording button', () => {
    render(<AudioRecorder />);
    const button = screen.getByText(/Start Recording/i);
    expect(button).toBeInTheDocument();
  });

  test('shows recording status when recording', async () => {
    render(<AudioRecorder />);
    const button = screen.getByText(/Start Recording/i);
    
    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByText(/Recording.../i)).toBeInTheDocument();
  });

  test('handles microphone access error', async () => {
    global.navigator.mediaDevices.getUserMedia = jest.fn().mockRejectedValue(
      new Error('Permission denied')
    );

    render(<AudioRecorder />);
    
    // Wait for error message
    const errorMessage = await screen.findByText(/Error setting up recording/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
