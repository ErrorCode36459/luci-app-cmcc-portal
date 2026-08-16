include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-cmcc-portal
PKG_VERSION:=1.0.2
PKG_RELEASE:=1
PKG_LICENSE:=MIT
PKG_MAINTAINER:=ErrorCode36459

include $(INCLUDE_DIR)/package.mk

define Package/luci-app-cmcc-portal
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Applications
  TITLE:=LuCI support for Jiangsu Mobile Captive Portal auto login
  PKGARCH:=all
  DEPENDS:=+curl +luci-base
endef

define Package/luci-app-cmcc-portal/description
 Modern JavaScript LuCI frontend and watchdog for wlan.jsyd139.com Captive Portal auto authentication.
endef

define Build/Compile
endef

define Package/luci-app-cmcc-portal/install
	$(CP) ./files/* $(1)/
endef

$(eval $(call BuildPackage,luci-app-cmcc-portal))
