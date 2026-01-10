export default function UserProfile() {
  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3 px-3 py-2">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvx3IYIsKawr8tdec4Cw2DPdW31TOnJvYyAcZB_sGzPe9yqREDl1OjTvR9UqhvlUIlpegNzJy8JsDUfX0xN4S0ILekeeFgKcYKjQ1-ChconM2_8P_5M2zNn-CngTqNmx1Qm3mmf5B3WF0_aqn_o4lNsdQm00aWaNvpAO1xK1Fo_olIVhTLgpWe17VSYE_snHO2XS0bGDGkkE5JtNgOGc4lZio2AFqfMklFP65tAyeB384qGvJNuT1UCO9f3fYUfM1bJehAvxYXuiE")',
          }}
        />
        <div className="flex flex-col">
          <p className="text-sm font-medium">Alex Rivera</p>
          <p className="text-xs text-[#4c739a]">System Admin</p>
        </div>
      </div>
    </div>
  )
}