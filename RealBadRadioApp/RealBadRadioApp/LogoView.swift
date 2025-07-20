import SwiftUI

struct LogoView: View {
    @State private var showAlternateLogo = false
    
    var body: some View {
        ZStack {
            // Main logo (bottom layer)
            Image("real-bad-radio-2")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .opacity(showAlternateLogo ? 0 : 1)
                .animation(.easeInOut(duration: 0.5), value: showAlternateLogo)
            
            // Alternate logo (top layer)
            Image("real-bad-radio")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .opacity(showAlternateLogo ? 1 : 0)
                .animation(.easeInOut(duration: 0.5), value: showAlternateLogo)
        }
        .frame(maxWidth: 300, maxHeight: 200)
        .onAppear {
            startLogoAnimation()
        }
    }
    
    private func startLogoAnimation() {
        // Animate logo every 15 seconds (similar to website)
        Timer.scheduledTimer(withTimeInterval: 15.0, repeats: true) { _ in
            withAnimation {
                showAlternateLogo.toggle()
            }
        }
    }
}

struct LogoView_Previews: PreviewProvider {
    static var previews: some View {
        LogoView()
            .padding()
    }
} 