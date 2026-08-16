'use strict';
'require view';
'require form';
'require uci';
'require fs';
'require ui';

function runBackend(action) {
	return fs.exec('/usr/bin/cmcc-portal', [ action ]).then(function(res) {
		var out = ((res.stdout || '') + (res.stderr || '')).trim();
		if (!out)
			out = _('命令已执行，返回代码：') + String(res.code);

		ui.addNotification(
			null,
			E('pre', { 'style': 'white-space:pre-wrap; margin:0' }, out),
			res.code === 0 ? 'info' : 'warning'
		);

		return res;
	});
}

return view.extend({
	load: function() {
		return Promise.all([
			uci.load('cmcc_portal'),
			fs.exec('/usr/bin/cmcc-portal', [ 'status' ]).catch(function() {
				return { code: 1, stdout: _('状态获取失败'), stderr: '' };
			}),
			fs.exec('/usr/bin/cmcc-portal', [ 'logs' ]).catch(function() {
				return { code: 1, stdout: _('暂无日志'), stderr: '' };
			})
		]);
	},

	render: function(data) {
		var m, s, o;
		var statusText = ((data[1].stdout || '') + (data[1].stderr || '')).trim() || _('暂无状态');
		var logText = ((data[2].stdout || '') + (data[2].stderr || '')).trim() || _('暂无日志');

		m = new form.Map(
			'cmcc_portal',
			_('江苏移动 Portal 自动认证'),
			_('用于 iStoreOS/OpenWrt 有线 WAN 接入 wlan.jsyd139.com Captive Portal。路由器认证成功后，下游设备通过 NAT 共享网络。')
		);

		s = m.section(form.NamedSection, 'main', 'portal', _('当前状态'));
		s.addremove = false;

		o = s.option(form.DummyValue, '_status', _('状态'));
		o.cfgvalue = function() { return statusText; };
		o.textvalue = function() { return statusText; };

		s = m.section(form.NamedSection, 'main', 'portal', _('基本设置'));
		s.addremove = false;

		o = s.option(form.Flag, 'enabled', _('启用自动认证'));
		o.default = '0';
		o.rmempty = false;
		o.description = _('开启后后台守护进程会按检测间隔检查网络，认证失效时自动重新登录。');

		o = s.option(form.ListValue, 'login_mode', _('登录模式'));
		o.value('cookie', _('记住密码 Cookie 模式（推荐）'));
		o.value('plain', _('普通账号密码模式（实验）'));
		o.default = 'cookie';
		o.rmempty = false;

		o = s.option(form.Value, 'username', _('登录账号'));
		o.rmempty = true;

		o = s.option(form.Value, 'password', _('登录密码'));
		o.password = true;
		o.rmempty = true;

		o = s.option(form.Value, 'remember_cookie', _('记住密码 Cookie'));
		o.password = true;
		o.rmempty = true;
		o.depends('login_mode', 'cookie');
		o.description = _('粘贴浏览器成功登录请求中的 Cookie 字符串。至少包含 UserName、province、UserType、PassWord；旧 JSESSIONID 和 X-LB 会被自动忽略。');

		o = s.option(form.Value, 'interval', _('检测间隔（秒）'));
		o.datatype = 'uinteger';
		o.default = '60';
		o.rmempty = false;
		o.description = _('建议 30～300 秒；后台最低按 15 秒处理。');

		s = m.section(form.NamedSection, 'main', 'portal', _('高级设置'));
		s.addremove = false;

		o = s.option(form.Value, 'trigger_url', _('Portal 触发地址'));
		o.default = 'http://www.baidu.com/';
		o.rmempty = false;

		o = s.option(form.Value, 'check_url', _('联网检测地址'));
		o.default = 'https://www.baidu.com/';
		o.rmempty = false;

		s = m.section(form.NamedSection, 'main', 'portal', _('操作'));
		s.addremove = false;

		o = s.option(form.Button, '_login', _('立即认证'));
		o.inputstyle = 'apply';
		o.onclick = function() {
			return runBackend('login').then(function() {
				window.setTimeout(function() { window.location.reload(); }, 800);
			});
		};

		o = s.option(form.Button, '_check', _('检测网络'));
		o.inputstyle = 'reload';
		o.onclick = function() {
			return runBackend('status');
		};

		o = s.option(form.Button, '_restart', _('重启守护进程'));
		o.inputstyle = 'reset';
		o.onclick = function() {
			return runBackend('restart');
		};

		s = m.section(form.NamedSection, 'main', 'portal', _('最近日志'));
		s.addremove = false;

		o = s.option(form.TextValue, '_log', _('日志'));
		o.rows = 16;
		o.readonly = true;
		o.cfgvalue = function() { return logText; };
		o.write = function() {};

		return m.render();
	}
});
